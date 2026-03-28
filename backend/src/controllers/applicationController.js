const getPrisma = () => {
  try { return require("../db/prisma"); } catch { return null; }
};

exports.applyToJob = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(503).json({ error: "Database unavailable" });

    const jobId = parseInt(req.params.id);
    if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job id" });

    if (req.user.role !== "JOB_SEEKER") {
      return res.status(403).json({ error: "Only job seekers can apply" });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: "Job not found" });

    const application = await prisma.application.create({
      data: { job_id: jobId, user_id: req.user.id, status: "PENDING" },
    });

    return res.status(201).json(application);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "You have already applied to this job" });
    }
    console.error("applyToJob error:", err);
    res.status(500).json({ error: "Failed to submit application." });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(503).json({ error: "Database unavailable" });

    const apps = await prisma.application.findMany({
      where: { user_id: req.user.id },
      include: {
        job: {
          include: { recruiter: { select: { name: true, email: true } } },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return res.json(apps);
  } catch (err) {
    console.error("getMyApplications error:", err);
    res.status(500).json({ error: "Failed to fetch applications." });
  }
};

exports.getApplicantsForJob = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(503).json({ error: "Database unavailable" });

    const jobId = parseInt(req.params.id);
    if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job id" });

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (job.recruiter_id !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to view these applicants" });
    }

    const applicants = await prisma.application.findMany({
      where: { job_id: jobId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        job: { select: { id: true, title: true, company_name: true } },
      },
      orderBy: { created_at: "desc" },
    });

    return res.json(applicants);
  } catch (err) {
    console.error("getApplicantsForJob error:", err);
    res.status(500).json({ error: "Failed to fetch applicants." });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const prisma = getPrisma();
    if (!prisma) return res.status(503).json({ error: "Database unavailable" });

    const appId = parseInt(req.params.id);
    const { status } = req.body;

    if (isNaN(appId)) return res.status(400).json({ error: "Invalid application id" });

    const VALID_STATUSES = ["PENDING", "ACCEPTED", "REJECTED"];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` });
    }

    const app = await prisma.application.findUnique({
      where: { id: appId },
      include: { job: { select: { recruiter_id: true } } },
    });

    if (!app) return res.status(404).json({ error: "Application not found" });

    if (app.job.recruiter_id !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized to update this application" });
    }

    const updated = await prisma.application.update({
      where: { id: appId },
      data: { status },
    });

    return res.json(updated);
  } catch (err) {
    console.error("updateApplicationStatus error:", err);
    res.status(500).json({ error: "Failed to update application status." });
  }
};