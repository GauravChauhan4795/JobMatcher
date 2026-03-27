const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

router.post("/", auth, createJob);
router.get("/", getJobs);
router.get("/:id", getJobById);
router.patch("/:id", auth, updateJob);
router.delete("/:id", auth, deleteJob);

module.exports = router;