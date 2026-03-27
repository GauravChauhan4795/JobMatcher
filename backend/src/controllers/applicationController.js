const prisma = require("../db/prisma");

exports.applyToJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);

    if (isNaN(jobId)) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    if (req.user.role !== "JOB_SEEKER") {
      return res.status(403).json({ error: "Only job seekers allowed" });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const application = await prisma.application.create({
      data: {
        job_id: jobId,
        user_id: req.user.id,
        status: "PENDING",
      },
    });

    res.json(application);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "Already applied" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const apps = await prisma.application.findMany({
      where: { user_id: req.user.id },
      include: {
        job: true,
      },
    });

    res.json(apps);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getApplicantsForJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);

    if (isNaN(jobId)) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.recruiter_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const applicants = await prisma.application.findMany({
      where: { job_id: jobId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(applicants);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};