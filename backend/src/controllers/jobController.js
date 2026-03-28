const prisma = require("../db/prisma");

exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== "RECRUITER") {
      return res.status(403).json({ error: "Only recruiters can post jobs" });
    }

    const recruiter = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { recruiterStatus: true },
    });

    if (!recruiter) {
      return res.status(404).json({ error: "User not found" });
    }

    if (recruiter.recruiterStatus !== "APPROVED") {
      return res.status(403).json({
        error:
          recruiter.recruiterStatus === "PENDING"
            ? "Your recruiter account is pending admin approval. Please wait before posting jobs."
            : "Your recruiter account has been rejected. You cannot post jobs.",
      });
    }

    const { title, description, company_name, location, job_type, salary, skills } = req.body;

    if (!title || !description || !company_name) {
      return res.status(400).json({
        error: "title, description, and company_name are required",
      });
    }

    const skillsArray = Array.isArray(skills)
      ? skills.map((s) => String(s).trim()).filter(Boolean)
      : typeof skills === "string" && skills.trim()
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const job = await prisma.job.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        company_name: company_name.trim(),
        location: location ? location.trim() : null,
        job_type: job_type ? job_type.trim() : null,
        salary: salary ? salary.trim() : null,
        skills: skillsArray,
        recruiter_id: req.user.id,
      },
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("createJob error:", err);
    res.status(500).json({ error: "Failed to create job. Please try again." });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        recruiter: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: { created_at: "desc" },
    });

    res.json(jobs || []);
  } catch (err) {
    console.error("getJobs error:", err);
    res.status(500).json({ error: "Failed to fetch jobs. Please try again." });
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
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(job);
  } catch (err) {
    console.error("getJobById error:", err);
    res.status(500).json({ error: "Failed to fetch job." });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);

    if (isNaN(jobId)) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    if (req.user.role !== "RECRUITER" && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (req.user.role === "RECRUITER" && job.recruiter_id !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to edit this job" });
    }

    const { title, description, company_name, location, job_type, salary, skills } = req.body;

    const skillsArray = Array.isArray(skills)
      ? skills.map((s) => String(s).trim()).filter(Boolean)
      : typeof skills === "string" && skills.trim()
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(company_name && { company_name: company_name.trim() }),
        ...(location !== undefined && { location: location ? location.trim() : null }),
        ...(job_type !== undefined && { job_type: job_type ? job_type.trim() : null }),
        ...(salary !== undefined && { salary: salary ? salary.trim() : null }),
        ...(skillsArray !== undefined && { skills: skillsArray }),
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("updateJob error:", err);
    res.status(500).json({ error: "Failed to update job." });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);

    if (isNaN(jobId)) {
      return res.status(400).json({ error: "Invalid job id" });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.recruiter_id !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Not authorized" });
    }

    await prisma.$transaction([
      prisma.application.deleteMany({ where: { job_id: jobId } }),
      prisma.job.delete({ where: { id: jobId } }),
    ]);

    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("deleteJob error:", err);
    res.status(500).json({ error: "Failed to delete job." });
  }
};