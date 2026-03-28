const prisma = require("../db/prisma");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { extractSkills } = require("../utils/skillExtractor");
const { calculateMatchScore } = require("../utils/matchJobs");
const { analyzeResumeText } = require("../utils/resumeAnalysis");

const withTimeout = (promise, ms, label) => {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

const parsePdfText = async (filePath) => {
  const start = Date.now();
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await withTimeout(
    pdfParse(dataBuffer, {
      normalizeWhitespace: true,
    }),
    30000,
    "PDF parsing"
  );
  const text = pdfData?.text || "";
  return { text: text.trim(), ms: Date.now() - start };
};

const cleanupFile = (filePath) => {
  if (filePath) {
    try { fs.unlinkSync(filePath); } catch (_) {}
  }
};

exports.uploadResume = async (req, res) => {
  const filePath = req.file?.path;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Please attach a PDF file." });
    }

    const { text } = await parsePdfText(filePath);

    if (!text || text.length < 50) {
      return res.status(422).json({
        error: "We couldn't extract readable text from this PDF. If it's a scanned document, please use an OCR tool first or export a text-based PDF.",
      });
    }

    const skills = extractSkills(text);

    const resume = await withTimeout(
      prisma.resume.upsert({
        where: {
          id: (await prisma.resume.findFirst({
            where: { user_id: req.user.id },
            orderBy: { uploaded_at: "desc" },
            select: { id: true },
          }))?.id ?? -1,
        },
        update: {
          raw_text: text,
          content: text,
          skills,
          uploaded_at: new Date(),
        },
        create: {
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
      skillCount: skills.length,
    });
  } catch (err) {
    console.error("uploadResume error:", err);
    if (err.message?.includes("timed out")) {
      return res.status(504).json({ error: "Request timed out. Please try a smaller PDF." });
    }
    res.status(500).json({ error: "Failed to upload resume. Please try again." });
  } finally {
    cleanupFile(filePath);
  }
};

exports.analyzeResume = async (req, res) => {
  const filePath = req.file?.path;
  const start = Date.now();

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Please attach a PDF file." });
    }

    const { text, ms: parseMs } = await parsePdfText(filePath);

    if (!text || text.length < 50) {
      return res.status(422).json({
        error: "We couldn't extract readable text from this PDF. Please try a text-based PDF.",
      });
    }

    const jobDescription = req.body?.jobDescription || "";

    if (req.user?.id) {
      prisma.resume.create({
        data: {
          user_id: req.user.id,
          raw_text: text,
          content: text,
          skills: extractSkills(text),
        },
      }).catch((err) => console.warn("Background resume save failed:", err?.message));
    }

    const { analysis } = await withTimeout(
      analyzeResumeText(text, jobDescription),
      35000,
      "AI analysis"
    );

    let topMatches = [];
    try {
      const skills = analysis.skills.map((s) => s.name.toLowerCase());
      const jobs = await withTimeout(
        prisma.job.findMany({
          take: 20,
          select: { id: true, title: true, company_name: true, salary: true, skills: true },
        }),
        8000,
        "Job lookup"
      );

      topMatches = jobs
        .map((j) => ({
          id: j.id,
          title: j.title,
          company: j.company_name,
          salary: j.salary || "Not specified",
          match: calculateMatchScore(skills, j.skills || []),
        }))
        .sort((a, b) => b.match - a.match)
        .slice(0, 3);
    } catch (err) {
      console.warn("Job matching failed:", err?.message);
    }

    console.info("Resume analysis completed", {
      parseMs,
      skillCount: analysis.skills.length,
      totalMs: Date.now() - start,
    });

    res.json({
      overallScore: analysis.overallScore,
      skills: analysis.skills,
      topMatches,
      strengths: analysis.strengths,
      gaps: analysis.gaps,
      recommendations: analysis.recommendations,
    });
  } catch (err) {
    console.error("analyzeResume error:", err);
    if (err.message?.includes("timed out")) {
      return res.status(504).json({ error: "Analysis timed out. Please try a smaller PDF." });
    }
    if (req.file) {
      try {
        const { text } = await parsePdfText(filePath).catch(() => ({ text: "" }));
        if (text) {
          const skills = extractSkills(text);
          const skillObjects = skills.slice(0, 10).map((name, i) => ({
            name,
            level: i < 2 ? "Advanced" : "Intermediate",
            score: Math.max(55, 90 - i * 5),
          }));
          return res.json({
            overallScore: Math.min(85, 50 + skills.length * 4),
            skills: skillObjects,
            topMatches: [],
            strengths: skills.slice(0, 4).map((s) => `Proficiency in ${s}`),
            gaps: [],
            recommendations: [
              { icon: "📚", text: "Add certifications to strengthen your profile." },
              { icon: "🚀", text: "Contribute to open source projects in your stack." },
              { icon: "🎯", text: "Tailor your resume keywords to each job description." },
            ],
          });
        }
      } catch (_) {}
    }
    res.status(500).json({ error: "Analysis failed. Please try again." });
  } finally {
    cleanupFile(filePath);
  }
};