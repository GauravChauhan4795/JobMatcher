const prisma = require("../db/prisma");
const { calculateMatchScore } = require("../utils/matchJobs");

exports.getMatchedJobs = async (req, res) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { user_id: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!resume) {
      return res.status(400).json({ error: "No resume found" });
    }

    const userSkills = resume.skills;

    const jobs = await prisma.job.findMany();

    const matchedJobs = jobs.map(job => {
      const score = calculateMatchScore(userSkills, job.skills);

      return {
        ...job,
        matchScore: score,
      };
    });

    matchedJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchedJobs);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};