const prisma = require("../db/prisma");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { extractSkills } = require("../utils/skillExtractor");

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