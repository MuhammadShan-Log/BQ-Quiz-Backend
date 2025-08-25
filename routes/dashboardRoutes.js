const express = require("express");
const {
  getTeacherStats,
  getStudentDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");
const { protect, authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/teacher", protect, authMiddleware(['teacher']), getTeacherStats);
router.get("/student", protect, authMiddleware(['student']), getStudentDashboard);
router.get("/admin", protect, authMiddleware(['admin']), getAdminDashboard);

module.exports = router;
