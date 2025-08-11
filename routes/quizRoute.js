const express = require("express");
const Joi = require("joi");
const Quiz = require("../models/quiz");

const router = express.Router();

// Joi validation for questions
const questionSchema = Joi.object({
  question: Joi.string().required(),
  isTextarea: Joi.boolean().default(false),
  options: Joi.when("isTextarea", {
    is: false,
    then: Joi.array().items(Joi.string().required()).length(4).required(),
    otherwise: Joi.array().items(Joi.string()).max(0),
  }),
  correctOption: Joi.when("isTextarea", {
    is: false,
    then: Joi.number().integer().min(0).max(3).required(),
    otherwise: Joi.number().forbidden(),
  }),
  correctAnswer: Joi.when("isTextarea", {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.string().forbidden(),
  }),
});

// Create Quiz Schema
const createQuizSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  timeDuration: Joi.number().integer().min(1).required(),
  quizKey: Joi.string().required(),
  questions: Joi.array().items(questionSchema).min(1).required(),
});

// Update Quiz Schema (all fields optional except ID)
const updateQuizSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  timeDuration: Joi.number().integer().min(1).optional(),
  quizKey: Joi.string().optional(),
  questions: Joi.array().items(questionSchema).min(1).optional(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// CREATE Quiz
router.post("/create", validate(createQuizSchema), async (req, res) => {
  try {
    const { title, description, timeDuration, quizKey, questions } = req.body;

    const newQuiz = new Quiz({
      title,
      description,
      timeDuration,
      quizKey,
      questions,
    });

    await newQuiz.save();

    res.status(201).json({ quizId: newQuiz._id.toString() });
  } catch (error) {
    console.error("Quiz creation error:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

// GET All Quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions -quizKey"); // Exclude sensitive data if needed
    res.status(200).json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

// GET Single Quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

// UPDATE Quiz by ID
router.put("/:id", validate(updateQuizSchema), async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error("Quiz update error:", error);
    res.status(500).json({ error: "Failed to update quiz" });
  }
});

// DELETE Quiz by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!deletedQuiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }
    res.status(200).json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Quiz deletion error:", error);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
});

module.exports = router;
