const prisma = require("../db/prisma");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { extractSkills } = require("../utils/skillExtractor");
const { calculateMatchScore } = require("../utils/matchJobs");

const withTimeout = (promise, ms, label) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

const now = () => Date.now();

const parsePdfText = async (filePath) => {
  const start = now();
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await withTimeout(pdfParse(dataBuffer), 20000, "PDF parsing");
  const text = pdfData?.text || "";
  return { text, ms: now() - start };
};

exports.uploadResume = async (req, res) => {
  let filePath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { text } = await parsePdfText(filePath);
    if (!text.trim()) {
      return res.status(422).json({
        error: "We couldn't read text from this PDF. If it's scanned, please OCR or export text and try again.",
      });
    }

    const skills = extractSkills(text);

    const resume = await withTimeout(
      prisma.resume.create({
        data: {
          user_id: req.user.id,
          raw_text: text,
          content: text,
          skills,
        },
      }),
      8000,
      "Resume save"
    );

    res.json({
      message: "Resume uploaded successfully",
      skills,
      resumeId: resume.id,
    });
  } catch (err) {
    console.error("uploadResume error:", err);
    if (err?.message?.includes("PDF parsing timed out")) {
      return res.status(504).json({
        error: "PDF parsing is taking too long. Try a smaller or text-based PDF.",
      });
    }
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (filePath) {
      try { fs.unlinkSync(filePath); } catch (_) {}
    }
  }
};

exports.analyzeResume = async (req, res) => {
  let filePath = req.file?.path;
  const start = now();
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { text, ms: parseMs } = await parsePdfText(filePath);
    if (!text.trim()) {
      return res.status(422).json({
        error: "We couldn't read text from this PDF. If it's scanned, please OCR or export text and try again.",
      });
    }

    const skills = extractSkills(text);

    if (req.user?.id) {
      try {
        await withTimeout(
          prisma.resume.create({
            data: {
              user_id: req.user.id,
              raw_text: text,
              content: text,
              skills,
            },
          }),
          8000,
          "Resume save"
        );
      } catch (err) {
        console.warn("Resume save failed:", err?.message || err);
      }
    }

    const skillObjects = skills.map((name, i) => ({
      name,
      level: i < 2 ? "Expert" : i < 4 ? "Advanced" : "Intermediate",
      score: Math.max(55, 95 - i * 7),
    }));

    const overallScore = skills.length > 0
      ? Math.min(98, 55 + skills.length * 4)
      : 40;

    let jobs = [];
    try {
      jobs = await withTimeout(prisma.job.findMany({ take: 20 }), 8000, "Job lookup");
    } catch (err) {
      console.warn("Job lookup failed:", err?.message || err);
    }

    const topMatches = jobs
      .map(j => ({
        title: j.title,
        company: j.company_name,
        salary: j.salary || "Not specified",
        match: calculateMatchScore(skills, j.skills || []),
      }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);

    const strengths = skills.slice(0, 4).map(s => `Strong proficiency in ${s}`);
    const allSkills = ["docker", "kubernetes", "graphql", "redis", "terraform"];
    const gaps = allSkills
      .filter(s => !skills.includes(s))
      .slice(0, 3)
      .map(s => `Consider learning ${s}`);

    const recommendations = [
      { icon: "\ud83d\udcda", text: "Add certifications to strengthen your profile." },
      { icon: "\ud83d\ude80", text: "Contribute to open source projects in your stack." },
      { icon: "\ud83c\udfaf", text: "Tailor your resume keywords to each job description." },
    ];

    console.info("Resume analysis completed", {
      parseMs,
      skills: skills.length,
      totalMs: now() - start,
    });

    res.json({
      overallScore,
      skills: skillObjects,
      topMatches,
      strengths,
      gaps,
      recommendations,
    });
  } catch (err) {
    console.error("analyzeResume error:", err);
    if (err?.message?.includes("PDF parsing timed out")) {
      return res.status(504).json({
        error: "PDF parsing is taking too long. Try a smaller or text-based PDF.",
      });
    }
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (filePath) {
      try { fs.unlinkSync(filePath); } catch (_) {}
    }
  }
};
