const express = require("express");

const {
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getAllQuizzes,
  viewQuizTeachers,
  getQuizForStudents,
} = require("../controllers/quizController");
const { submitQuiz, getAttemptsForTeacher } = require("../controllers/attemptController");
const { protect, authMiddleware } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// For Teachers
router.get("/quiz", protect, getAllQuizzes);
router.post("/quiz", protect, upload.single("file"), createQuiz);
router.get("/quiz/attempts", protect, authMiddleware(['teacher']), getAttemptsForTeacher);
router.get("/quiz/:id", protect, viewQuizTeachers);

router.put("/quiz/:id", protect, upload.single("file"), updateQuiz);

router.delete("/quiz/:id", protect, deleteQuiz);

router.post("/quiz/submit", protect, submitQuiz);

// For Students
router.get("/quiz/:id/start", protect, getQuizForStudents);

module.exports = router;

