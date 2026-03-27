const getPrisma = () => {
  try { return require("../db/prisma"); } catch { return null; }
};

exports.applyToJob = async (req, res) => {
  try {
    const prisma = getPrisma();
    const jobId = parseInt(req.params.id);
    if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job id" });
    if (req.user.role !== "JOB_SEEKER") return res.status(403).json({ error: "Only job seekers can apply" });

    if (prisma) {
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) return res.status(404).json({ error: "Job not found" });
      const application = await prisma.application.create({ data: { job_id: jobId, user_id: req.user.id, status: "PENDING" } });
      return res.json(application);
    }
  } catch (err) {
    if (err.code === "P2002") return res.status(400).json({ error: "Already applied" });
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (prisma) {
      const apps = await prisma.application.findMany({
        where: { user_id: req.user.id },
        include: { job: { include: { recruiter: { select: { name: true, email: true } } } } },
        orderBy: { created_at: "desc" },
      });
      return res.json(apps);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getApplicantsForJob = async (req, res) => {
  try {
    const prisma = getPrisma();
    const jobId = parseInt(req.params.id);
    if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job id" });

    if (prisma) {
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) return res.status(404).json({ error: "Job not found" });
      if (job.recruiter_id !== req.user.id && req.user.role !== "ADMIN") return res.status(403).json({ error: "Not authorized" });
      const applicants = await prisma.application.findMany({
        where: { job_id: jobId },
        include: { user: { select: { id: true, name: true, email: true } }, job: true },
        orderBy: { created_at: "desc" },
      });
      return res.json(applicants);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const prisma = getPrisma();
    const appId = parseInt(req.params.id);
    const { status, note } = req.body;

    if (isNaN(appId)) return res.status(400).json({ error: "Invalid application id" });
    if (!["PENDING", "REVIEWING", "ACCEPTED", "REJECTED"].includes(status)) return res.status(400).json({ error: "Invalid status" });

    if (prisma) {
      const app = await prisma.application.findUnique({ where: { id: appId }, include: { job: true } });
      if (!app) return res.status(404).json({ error: "Application not found" });
      if (app.job.recruiter_id !== req.user.id && req.user.role !== "ADMIN") return res.status(403).json({ error: "Not authorized" });
      const updated = await prisma.application.update({ where: { id: appId }, data: { status, note: note || null } });
      return res.json(updated);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

