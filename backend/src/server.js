require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

const optAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try { req.user = jwt.verify(token, process.env.JWT_SECRET || "dev_secret"); } catch {}
  }
  next();
};

const authCtrl = require("./controllers/authController");
const jobCtrl = require("./controllers/jobController");
const appCtrl = require("./controllers/applicationController");
const adminCtrl = require("./controllers/adminController");
const resumeCtrl = require("./controllers/resumeController");
const upload = require("./middleware/upload");
const matchCtrl = require("./controllers/matchController");

app.post("/auth/register", authCtrl.register);
app.post("/auth/login", authCtrl.login);

app.get("/jobs", optAuth, jobCtrl.getJobs);
app.get("/jobs/:id", optAuth, jobCtrl.getJobById);
app.post("/jobs", auth, jobCtrl.createJob);
app.delete("/jobs/:id", auth, jobCtrl.deleteJob);

app.post("/applications/:id/apply", auth, appCtrl.applyToJob);
app.get("/applications/me", auth, appCtrl.getMyApplications);
app.get("/applications/:id/applicants", auth, appCtrl.getApplicantsForJob);
app.patch("/applications/:id/status", auth, appCtrl.updateApplicationStatus);

app.post("/resume", auth, resumeCtrl.uploadResumeText);
app.post("/resume/upload", auth, upload.single("resume"), resumeCtrl.uploadResume);
app.post("/resume/analyze", auth, upload.single("resume"), resumeCtrl.analyzeResume);

app.get("/routes", auth, matchCtrl.getMatchedJobs);

app.get("/admin/stats", auth, adminCtrl.getStats);
app.get("/admin/recruiters", auth, adminCtrl.getRecruiters);
app.patch("/admin/recruiters/:id/status", auth, adminCtrl.updateRecruiterStatus);
app.get("/admin/jobs", auth, adminCtrl.getAllJobs);
app.get("/admin/users", auth, adminCtrl.getAllUsers);

app.get("/", (req, res) => res.send("SJ_Map API Running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
