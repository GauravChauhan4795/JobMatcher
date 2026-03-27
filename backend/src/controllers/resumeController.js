const prisma = require("../db/prisma");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { extractSkills } = require("../utils/skillExtractor");
const { calculateMatchScore } = require("../utils/matchJobs");

const safeUnlink = (path) => {
  try { fs.unlinkSync(path); } catch {}
};

const parseResumeFile = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text || "";
};

const buildSkillBreakdown = (skills) => {
  const levels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  return skills.map((name, idx) => {
    const score = Math.max(55, 95 - idx * 7);
    const level = score >= 85 ? "Expert" : score >= 75 ? "Advanced" : score >= 65 ? "Intermediate" : "Beginner";
    return { name, score, level };
  });
};

exports.uploadResumeText = async (req, res) => {
  try {
    const text = String(req.body?.raw_text || "").trim();
    if (!text) return res.status(400).json({ error: "No text provided" });

    const skills = extractSkills(text);
    const resume = await prisma.resume.create({
      data: {
        user_id: req.user.id,
        content: text,
        raw_text: text,
        skills,
      },
    });

    res.json({ message: "Resume text uploaded", skills, resumeId: resume.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const text = await parseResumeFile(req.file.path);
    const skills = extractSkills(text);

    const resume = await prisma.resume.create({
      data: {
        user_id: req.user.id,
        content: text,
        skills,
      },
    });

    safeUnlink(req.file.path);

    res.json({
      message: "Resume uploaded",
      skills,
      resumeId: resume.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const jobDescription = String(req.body?.jobDescription || "");
    const text = await parseResumeFile(req.file.path);

    const resumeSkills = extractSkills(text);
    const jdSkills = jobDescription ? extractSkills(jobDescription) : [];

    const resume = await prisma.resume.create({
      data: {
        user_id: req.user.id,
        content: text,
        skills: resumeSkills,
      },
    });

    safeUnlink(req.file.path);

    const overallScore = jdSkills.length
      ? calculateMatchScore(resumeSkills, jdSkills)
      : Math.min(95, Math.max(60, resumeSkills.length * 8));

    const allJobs = await prisma.job.findMany({
      orderBy: { created_at: "desc" },
    });

    const topMatches = allJobs
      .map((job) => ({
        title: job.title,
        company: job.company_name,
        salary: job.salary || "",
        match: calculateMatchScore(resumeSkills, job.skills || []),
      }))
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);

    const strengths = resumeSkills.slice(0, 5).map((s) => `Strong ${s} experience`);
    const gaps = jdSkills.filter((s) => !resumeSkills.map((r) => r.toLowerCase()).includes(s.toLowerCase())).slice(0, 5);

    const recommendations = [
      { icon: "TIP", text: "Tailor your resume keywords to the job description." },
      { icon: "DOC", text: "Highlight measurable outcomes for your key projects." },
      { icon: "JOB", text: "Apply to roles that align with your top skills." },
    ];

    return res.json({
      resumeId: resume.id,
      overallScore,
      skills: buildSkillBreakdown(resumeSkills),
      topMatches,
      strengths,
      gaps,
      recommendations,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};


