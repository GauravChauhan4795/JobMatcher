const getPrisma = () => {
  try { return require("../db/prisma"); } catch { return null; }
};

exports.getStats = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Admin only" });
    const prisma = getPrisma();

    if (prisma) {
      const [totalUsers, totalJobs, totalApps, pendingRecruiters, activeJobs] = await Promise.all([
        prisma.user.count(),
        prisma.job.count(),
        prisma.application.count(),
        prisma.user.count({ where: { role: "RECRUITER", recruiterStatus: "PENDING" } }),
        prisma.job.count(),
      ]);
      return res.json({
        totalUsers,
        totalJobs,
        totalApps,
        pendingRecruiters,
        pendingJobs: totalJobs,
        activeJobs,
      });
    }
  } catch (err) {
    console.error("GET STATS ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getRecruiters = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Admin only" });
    const prisma = getPrisma();

    if (prisma) {
      const recruiters = await prisma.user.findMany({
        where: { role: "RECRUITER" },
        select: { id: true, name: true, email: true, recruiterStatus: true, created_at: true },
        orderBy: { created_at: "desc" },
      });
      return res.json(recruiters);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateRecruiterStatus = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Admin only" });
    const prisma = getPrisma();
    const userId = parseInt(req.params.id);
    const { status } = req.body;

    if (isNaN(userId)) return res.status(400).json({ error: "Invalid user id" });
    if (!["PENDING", "APPROVED", "REJECTED"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    if (prisma) {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { recruiterStatus: status },
      });
      return res.json(user);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Admin only" });
    const prisma = getPrisma();

    if (prisma) {
      const jobs = await prisma.job.findMany({
        include: {
          recruiter: { select: { name: true, email: true } },
          _count: { select: { applications: true } },
        },
        orderBy: { created_at: "desc" },
      });
      return res.json(jobs);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") return res.status(403).json({ error: "Admin only" });
    const prisma = getPrisma();

    if (prisma) {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          recruiterStatus: true,
          created_at: true,
        },
        orderBy: { created_at: "desc" },
      });
      return res.json(users);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};