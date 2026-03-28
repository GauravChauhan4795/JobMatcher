const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { uploadResume, analyzeResume } = require("../controllers/resumeController");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();
  const token = authHeader.split(" ")[1];
  try {
    const jwt = require("jsonwebtoken");
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // invalid token — continue without user
  }
  next();
};

const handleUpload = (field) => async (req, res, next) => {
  try {
    await upload.single(field)(req, res);
    next();
  } catch (err) {
    return res.status(400).json({ error: err.message || "File upload failed" });
  }
};

router.post("/upload", auth, upload.single("resume"), uploadResume);
router.post("/upload-analyze", auth, upload.single("resume"), analyzeResume);

module.exports = router;