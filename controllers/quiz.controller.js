const Quiz = require("../models/quiz.model");

/**
 * Create a new quiz
 * Later: Add Joi validation for req.body
 */
exports.createQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);
    return res.apiSuccess(quiz, "Quiz created successfully", 201);
  } catch (error) {
    return res.apiError(error.message, "Error creating quiz", 500);
  }
};

/**
 * Get all quizzes
 * Later: Add pagination & filtering
 */
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    return res.apiSuccess(quizzes, "Quizzes fetched successfully");
  } catch (error) {
    return res.apiError(error.message, "Error fetching quizzes", 500);
  }
};

/**
 * Get a quiz by ID
 * Later: Validate ID format before querying
 */
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.apiError(null, "Quiz not found", 404);
    return res.apiSuccess(quiz, "Quiz fetched successfully");
  } catch (error) {
    return res.apiError(error.message, "Error fetching quiz", 500);
  }
};

/**
 * Update a quiz by ID
 * Later: Validate body fields before updating
 */
exports.updateQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!quiz) return res.apiError(null, "Quiz not found", 404);
    return res.apiSuccess(quiz, "Quiz updated successfully");
  } catch (error) {
    return res.apiError(error.message, "Error updating quiz", 500);
  }
};

/**
 * Delete a quiz by ID
 * Later: Confirm deletion via frontend modal
 */
exports.deleteQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.apiError(null, "Quiz not found", 404);
    return res.apiSuccess(null, "Quiz deleted successfully");
  } catch (error) {
    return res.apiError(error.message, "Error deleting quiz", 500);
  }
};
