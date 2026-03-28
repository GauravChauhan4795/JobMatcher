const prisma = require("../db/prisma");
const resolvePdfParser = (mod) => {
  if (!mod) return null;
  if (typeof mod === "function") return mod;
  if (typeof mod.default === "function") return mod.default;
  if (typeof mod.pdfParse === "function") return mod.pdfParse;
  if (typeof mod.parse === "function") return mod.parse;
  return null;
};
let pdfParserPromise = null;
const getPdfParser = async () => {
  if (pdfParserPromise) return pdfParserPromise;
  pdfParserPromise = (async () => {
    let mod = null;
    try { mod = require("pdf-parse"); } catch (_) {}
    let parser = resolvePdfParser(mod);
    if (parser) return parser;
    try {
      const imported = await import("pdf-parse");
      parser = resolvePdfParser(imported);
    } catch (_) {}
    return parser;
  })();
  return pdfParserPromise;
};
const fs = require("fs");
const path = require("path");
const { extractSkillsWithLLM } = require("../utils/skillExtractor");
const { analyzeResumeText } = require("../utils/resumeAnalysis");
const { calculateMatchScore } = require("../utils/matchJobs");

const uploadsDir = path.join(__dirname, "..", "..", "uploads");

const resolveFilePath = (fileUrl) => {
  if (!fileUrl) return null;
  const fileName = path.basename(fileUrl);
  return path.join(uploadsDir, fileName);
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfParseFn = await getPdfParser();
    if (!pdfParseFn) {
      throw new Error("PDF parser not available");
    }
    const pdfData = await pdfParseFn(dataBuffer);
    const text = pdfData.text;

    const skills = await extractSkillsWithLLM(text);
    const fileUrl = `/uploads/${req.file.filename}`;

    const resume = await prisma.resume.create({
      data: {
        user_id: req.user.id,
        raw_text: text,
        content: text,
        skills,
        file_url: fileUrl,
      },
    });

    res.json({
      message: "Resume uploaded successfully",
      skills,
      resumeId: resume.id,
      fileUrl,
    });
  } catch (err) {
    console.error("uploadResume error:", err);

    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const jobDescription = typeof req.body?.jobDescription === "string" ? req.body.jobDescription : "";

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfParseFn = await getPdfParser();
    if (!pdfParseFn) {
      throw new Error("PDF parser not available");
    }
    const pdfData = await pdfParseFn(dataBuffer);
    const text = pdfData.text || "";

    const { analysis, skillNames } = await analyzeResumeText(text, jobDescription);

    const jobs = await prisma.job.findMany({
      select: { title: true, company_name: true, salary: true, skills: true },
    });

    const topMatches = jobs
      .map((job) => ({
        title: job.title,
        company: job.company_name,
        salary: job.salary || "Not listed",
        match: calculateMatchScore(skillNames, job.skills || []),
      }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 5);

    fs.unlinkSync(req.file.path);

    res.json({
      ...analysis,
      topMatches,
    });
  } catch (err) {
    console.error("analyzeResume error:", err);

    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

exports.analyzeSavedResume = async (req, res) => {
  try {
    const jobDescription = typeof req.body?.jobDescription === "string" ? req.body.jobDescription : "";

    const resume = await prisma.resume.findFirst({
      where: { user_id: req.user.id },
      orderBy: { uploaded_at: "desc" },
    });

    if (!resume) {
      return res.status(404).json({ error: "No resume found" });
    }

    let text = resume.raw_text || resume.content || "";
    if (!text && resume.file_url) {
      const filePath = resolveFilePath(resume.file_url);
      if (filePath && fs.existsSync(filePath)) {
        const dataBuffer = fs.readFileSync(filePath);
        const pdfParseFn = await getPdfParser();
    if (!pdfParseFn) {
      throw new Error("PDF parser not available");
    }
    const pdfData = await pdfParseFn(dataBuffer);
        text = pdfData.text || "";
      }
    }

    const { analysis, skillNames } = await analyzeResumeText(text, jobDescription);

    const jobs = await prisma.job.findMany({
      select: { title: true, company_name: true, salary: true, skills: true },
    });

    const topMatches = jobs
      .map((job) => ({
        title: job.title,
        company: job.company_name,
        salary: job.salary || "Not listed",
        match: calculateMatchScore(skillNames, job.skills || []),
      }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 5);

    res.json({
      ...analysis,
      topMatches,
    });
  } catch (err) {
    console.error("analyzeSavedResume error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.downloadResume = async (req, res) => {
  try {
    const resumeId = parseInt(req.params.id);
    if (isNaN(resumeId)) return res.status(400).json({ error: "Invalid resume id" });

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      select: { id: true, user_id: true, file_url: true },
    });

    if (!resume || !resume.file_url) {
      return res.status(404).json({ error: "Resume file not found" });
    }

    const isOwner = resume.user_id === req.user.id;
    let allowed = isOwner || req.user.role === "ADMIN";

    if (!allowed && req.user.role === "RECRUITER") {
      const app = await prisma.application.findFirst({
        where: {
          user_id: resume.user_id,
          job: { recruiter_id: req.user.id },
        },
        select: { id: true },
      });
      allowed = Boolean(app);
    }

    if (!allowed) return res.status(403).json({ error: "Not authorized" });

    const filePath = resolveFilePath(resume.file_url);
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Resume file not found" });
    }

    return res.download(filePath);
  } catch (err) {
    console.error("downloadResume error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
