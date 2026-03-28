const getPrisma = () => {
  try { return require("../db/prisma"); } catch { return null; }
};

const requireAdmin = (req, res) => {
  if (req.user.role !== "ADMIN") {
    res.status(403).json({ error: "Admin access required" });
    return false;
  }
  return true;
};

exports.getStats = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const prisma = getPrisma();
    if (!prisma) return res.status(503).json({ error: "Database unavailable" });

    const [
      totalUsers,
      totalJobs,
      totalApps,
      pendingRecruiters,
      totalJobSeekers,
      totalRecruiters,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.user.count({ where: { role: "RECRUITER", recruiterStatus: "PENDING" } }),
      prisma.user.count({ where: { role: "JOB_SEEKER" } }),
      prisma.user.count({ where: { role: "RECRUITER" } }),
    ]);

    return res.json({
      totalUsers,
      totalJobs,
      totalApps,
      pendingRecruiters,
      activeJobs: totalJobs,
      totalJobSeekers,
      totalRecruiters,
    });
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ error: "Failed to fetch stats." });
  }
};

exports.getRecruiters = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const prisma = getPrisma();
    if (!prisma) return res.status(503).json({ error: "Database unavailable" });

    const recruiters = await prisma.user.findMany({
      where: { role: "RECRUITER" },
      select: {
        id: true,
        name: true,
        email: true,
        recruiterStatus: true,
        created_at: true,
        _count: { select: { jobs: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return res.json(recruiters);
  } catch (err) {
    console.error("getRecruiters error:", err);
    res.status(500).json({ error: "Failed to fetch recruiters." });
  }
};

exports.updateRecruiterStatus = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const prisma = getPrisma();
    if (!prisma) return res.status(503).json({ error: "Database unavailable" });

    const userId = parseInt(req.params.id);
    const { status } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const existing = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!existing) {
      return res.status(404).json({ error: "User not found" });
    }

    if (existing.role !== "RECRUITER") {
      return res.status(400).json({ error: "User is not a recruiter" });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { recruiterStatus: status },
      select: {
        id: true,
        name: true,
        email: true,
        recruiterStatus: true,
        role: true,
      },
    });

    return res.json(user);
  } catch (err) {
    console.error("updateRecruiterStatus error:", err);
    res.status(500).json({ error: "Failed to update recruiter status." });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const prisma = getPrisma();
    if (!prisma) return res.status(503).json({ error: "Database unavailable" });

    const jobs = await prisma.job.findMany({
      include: {
        recruiter: { select: { name: true, email: true } },
        _count: { select: { applications: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return res.json(jobs);
  } catch (err) {
    console.error("getAllJobs error:", err);
    res.status(500).json({ error: "Failed to fetch jobs." });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (!requireAdmin(req, res)) return;

    const prisma = getPrisma();
    if (!prisma) return res.status(503).json({ error: "Database unavailable" });

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
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};