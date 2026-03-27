const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getStats,
  getRecruiters,
  updateRecruiterStatus,
  getAllJobs,
  getAllUsers,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/stats", auth, getStats);
router.get("/recruiters", auth, getRecruiters);
router.patch("/recruiters/:id/status", auth, updateRecruiterStatus);
router.get("/jobs", auth, getAllJobs);
router.get("/users", auth, getAllUsers);

module.exports = router;
