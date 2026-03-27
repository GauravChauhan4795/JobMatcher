const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { getMatchedJobs } = require("../controllers/matchController");

router.get("/", auth, getMatchedJobs);

module.exports = router;