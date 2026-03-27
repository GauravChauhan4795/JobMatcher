const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  applyToJob,
  getMyApplications,
  getApplicantsForJob,
} = require("../controllers/applicationController");

const router = express.Router();

router.post("/:id/apply", auth, applyToJob);
router.get("/me", auth, getMyApplications);
router.get("/:id/applicants", auth, getApplicantsForJob);

module.exports = router;