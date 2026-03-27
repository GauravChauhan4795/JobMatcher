const getPrisma = () => {
  try { return require("../db/prisma"); } catch { return null; }
};

exports.createJob = async (req, res) => {
  try {
    const prisma = getPrisma();

    if (req.user.role !== "RECRUITER")  {
      return res.status(403).json({ error: "Only recruiters can post jobs" });
    }

    if (req.user.recruiterStatus !== "APPROVED") {
      return res.status(403).json({ error: "Your recruiter account is pending admin approval" });
    }

    const { title, description, company_name, location, job_type, salary, skills } = req.body;

    if (!title || !description || !company_name) return res.status(400).json({ error: "Missing required fields" });

    const normalizedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

    if (prisma) {
      const job = await prisma.job.create({
        data: { title, description, company_name, location: location || "Remote",
           job_type: job_type || "Full-time", salary: salary || "", skills: normalizedSkills,
           recruiter_id: req.user.id },
      });
      return res.json(job);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const prisma = getPrisma();
    const { recruiter_id } = req.query;

    if (prisma) {
      const where = {};
      if (recruiter_id) where.recruiter_id = parseInt(recruiter_id);
      if (req.user?.role === "RECRUITER" && req.user?.id) {
        where.recruiter_id = req.user.id;
      }

      const jobs = await prisma.job.findMany({ where, include: { recruiter: { select: { id: true, name: true,
         email: true } }, _count: { select: { applications: true } } }, orderBy: { created_at: "desc" } });
      return res.json(jobs);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const prisma = getPrisma();
    const jobId = parseInt(req.params.id);
    if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job id" });

    if (prisma) {
      const job = await prisma.job.findUnique({ where: { id: jobId }, include: { recruiter: { select: { id: true, name: true, email: true } } } });
      if (!job) return res.status(404).json({ error: "Job not found" });
      return res.json(job);
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const prisma = getPrisma();
    const jobId = parseInt(req.params.id);
    if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job id" });

    if (prisma) {
      const job = await prisma.job.findUnique({ where: { id: jobId } });
      if (!job) return res.status(404).json({ error: "Job not found" });
      if (job.recruiter_id !== req.user.id && req.user.role !== "ADMIN") return res.status(403).json({ error: "Not authorized" });
      await prisma.job.delete({ where: { id: job.id } });
      return res.json({ message: "Job deleted" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};


