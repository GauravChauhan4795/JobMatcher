const prisma = require("../db/prisma");
const { calculateMatchScore } = require("../utils/matchJobs");

exports.getMatchedJobs = async (req, res) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { user_id: req.user.id },
      orderBy: { uploaded_at: "desc" },
    });

    if (!resume) {
      return res.status(400).json({ error: "No resume found. Please upload a resume first." });
    }

    const userSkills = resume.skills || [];

    const jobs = await prisma.job.findMany({
      include: {
        recruiter: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    const matchedJobs = jobs
      .map((job) => ({
        ...job,
        matchScore: calculateMatchScore(userSkills, job.skills || []),
      }))
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedJobs);
  } catch (err) {
    console.error("getMatchedJobs error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};