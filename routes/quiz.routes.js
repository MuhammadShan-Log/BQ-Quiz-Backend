const express = require("express");
const router = express.Router();
const quizCtrl = require("../controllers/quiz.controller");

/**
 * Quiz Routes
 * NOTE: Currently no auth/validation.
 * To be added later by teammate:
 *  - Multer (for CSV uploads)
 *  - Joi validation for quiz schema
 *  - Auth middleware for login protection
 *  - Role middleware to restrict certain actions to "Teacher" role
 */

// CREATE Quiz
router.post("/", /* authenticate, authorize('Teacher'), */ quizCtrl.createQuiz);

// READ All Quizzes
router.get("/", /* authenticate, */ quizCtrl.getAllQuizzes);

// READ Single Quiz
router.get("/:id", /* authenticate, */ quizCtrl.getQuizById);

// UPDATE Quiz
router.put("/:id", /* authenticate, authorize('Teacher'), */ quizCtrl.updateQuizById);

// DELETE Quiz
router.delete("/:id", /* authenticate, authorize('Teacher'), */ quizCtrl.deleteQuizById);

module.exports = router;
