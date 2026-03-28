const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { uploadResume, analyzeResume, analyzeSavedResume, downloadResume } = require("../controllers/resumeController");

router.post("/upload", auth, upload.single("resume"), uploadResume);
router.post("/analyze", upload.single("resume"), analyzeResume);
router.post("/analyze/saved", auth, analyzeSavedResume);
router.get("/:id/download", auth, downloadResume);

module.exports = router;
