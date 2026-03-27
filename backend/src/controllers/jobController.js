const prisma = require("../db/prisma");

exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({ error: "Only recruiters allowed" });
    }

    const { title, description, company_name, skills } = req.body;

    if ( !title || !description || !company_name || !skills ) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        company_name,
        skills,
        recruiter_id: req.user.id,
      },
    });

    res.json(job);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        recruiter: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    res.json(jobs);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);

    if (isNaN(jobId)) {
      return res.status(400).json({ error: "Invalid job id" });
    }
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        recruiter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        }
      },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteJob = async (req, res) => {
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

    await prisma.job.delete({
      where: { id: job.id },
    });

    res.json({ message: "Job deleted" });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
};