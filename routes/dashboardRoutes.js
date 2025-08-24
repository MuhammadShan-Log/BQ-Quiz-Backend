const express = require("express");
const {
  getTeacherOverview,
  getRecentQuizzes,
  getStudentOverview,
  getAdminOverview
} = require("../controllers/dashboardController");
const { protect, authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/teacher/overview", protect, authMiddleware(['teacher']), getTeacherOverview);
router.get("/teacher/recent-quizzes", protect, authMiddleware(['teacher']), getRecentQuizzes);
router.get("/student/overview", protect, authMiddleware(['student']), getStudentOverview);
router.get("/admin/overview", protect, authMiddleware(['admin']), getAdminOverview);

module.exports = router;
