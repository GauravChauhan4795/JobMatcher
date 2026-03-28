const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { uploadResume, analyzeResume } = require("../controllers/resumeController");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") return next();
  const token = parts[1];
  try {
    const jwt = require("jsonwebtoken");
    req.user = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
  } catch {
    // invalid/expired token — continue without user
  }
  next();
};

router.post(
  "/upload",
  auth,
  upload.single("resume"),
  uploadResume
);

router.post(
  "/upload-analyze",
  optionalAuth,
  upload.single("resume"),
  analyzeResume
);

router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "File too large. Maximum size is 5MB." });
  }
  if (err.message && err.message.includes("Only PDF")) {
    return res.status(415).json({ error: err.message });
  }
  next(err);
});

module.exports = router;