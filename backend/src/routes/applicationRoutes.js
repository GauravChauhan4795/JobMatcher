const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const router = express.Router();

router.post("/:id/apply", auth, applyToJob);
router.get("/me", auth, getMyApplications);
router.get("/:id/applicants", auth, getApplicantsForJob);
router.patch("/:id/status", auth, updateApplicationStatus);

module.exports = router;
