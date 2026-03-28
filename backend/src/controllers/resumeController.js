const prisma = require("../db/prisma");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { extractSkills } = require("../utils/skillExtractor");
const { calculateMatchScore } = require("../utils/matchJobs");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;

    const skills = extractSkills(text);

    const resume = await prisma.resume.create({
      data: {
        user_id: req.user.id,
        raw_text: text,
        content: text,
        skills,
      },
    });

    fs.unlinkSync(req.file.path);

    res.json({
      message: "Resume uploaded successfully",
      skills,
      resumeId: resume.id,
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

    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;
    const skills = extractSkills(text);

    if (req.user?.id) {
      await prisma.resume.create({
        data: {
          user_id: req.user.id,
          raw_text: text,
          content: text,
          skills,
        },
      });
    }

    fs.unlinkSync(req.file.path);

    const skillObjects = skills.map((name, i) => ({
      name,
      level: i < 2 ? "Expert" : i < 4 ? "Advanced" : "Intermediate",
      score: Math.max(55, 95 - i * 7),
    }));

    const overallScore = skills.length > 0
      ? Math.min(98, 55 + skills.length * 4)
      : 40;

    const { calculateMatchScore } = require("../utils/matchJobs");
    const jobs = await prisma.job.findMany({ take: 20 });
    const topMatches = jobs
      .map(j => ({
        title: j.title,
        company: j.company_name,
        salary: j.salary || "Not specified",
        match: calculateMatchScore(skills, j.skills || []),
      }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);

    const jd = req.body.jobDescription || "";
    const strengths = skills.slice(0, 4).map(s => `Strong proficiency in ${s}`);
    const allSkills = ["docker", "kubernetes", "graphql", "redis", "terraform"];
    const gaps = allSkills
      .filter(s => !skills.includes(s))
      .slice(0, 3)
      .map(s => `Consider learning ${s}`);

    const recommendations = [
      { icon: "📚", text: "Add certifications to strengthen your profile." },
      { icon: "🚀", text: "Contribute to open source projects in your stack." },
      { icon: "🎯", text: "Tailor your resume keywords to each job description." },
    ];

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
    if (req.file?.path) {
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }
    res.status(500).json({ error: "Internal server error" });
  }
};