const prisma = require("../db/prisma");
const { calculateMatchScore } = require("../utils/matchJobs");

exports.getMatchedJobs = async (req, res) => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { user_id: req.user.id },
      orderBy: { uploaded_at: "desc" },
    });

    if (!resume) {
      const allJobs = await prisma.job.findMany({
        include: {
          recruiter: { select: { id: true, name: true, email: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { created_at: "desc" },
      });

      return res.json(allJobs.map((job) => ({ ...job, matchScore: 0 })));
    }

    const userSkills = resume.skills || [];

    const jobs = await prisma.job.findMany({
      include: {
        recruiter: { select: { id: true, name: true, email: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { created_at: "desc" },
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
    res.status(500).json({ error: "Failed to fetch matched jobs." });
  }
};