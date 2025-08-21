const express = require("express");
const {
  getTeacherOverview,
  getRecentQuizzes,
} = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/teacher/overview",protect, getTeacherOverview);
router.get("/teacher/recent-quizzes",protect, getRecentQuizzes);

module.exports = router;
