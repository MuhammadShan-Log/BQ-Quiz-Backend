const express = require("express");

const {
  createQuiz,
  getQuiz,
  deleteQuiz,
  updateQuiz,
} = require("../controllers/quizController");
const { submitQuiz } = require("../controllers/attemptController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.post("/quiz", protect, upload.single("file"), createQuiz);
router.get("/quiz/:id", protect, getQuiz);

router.put("/:id", protect, updateQuiz);

router.delete("/:id", protect, deleteQuiz);

router.post("/quiz/submit", protect, submitQuiz);

module.exports = router;
