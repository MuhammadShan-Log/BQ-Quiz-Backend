const Quiz = require("../models/QuizSechema");
const parseCSVFile = require("../utils/parseCSVFile");

exports.createQuiz = async (req, res) => {
  try {
    if (req.user.role !== "teacher")
      return res
        .status(403)
        .json({ message: "Only teacher can create quizzes" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const questions = await parseCSVFile(req.file.path);

    const { title, customQuestions } = req.body;

    const quiz = await Quiz.create({
      title,
      questions,
      customQuestions,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Quiz created", quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateQuiz = async (req, res) => {
  try {
    if (req.user.role !== "teacher")
      return res
        .status(403)
        .json({ message: "Only teacher can update quizzes" });

    const { title, customQuestions } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.createdBy.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "Not authorized to update this quiz" });

    if (title) quiz.title = title;

    if (req.file) {
      const questions = await parseCSVFile(req.file.path);
      quiz.questions = questions;
    }

    if (customQuestions) quiz.customQuestions = customQuestions;

    await quiz.save();

    res.json({ message: "Quiz updated", quiz });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select(
      "-questions.correctAnswer"
    );

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteQuiz = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teacher can delete quizzes" });
    }

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this quiz" });
    }

    await quiz.deleteOne();

    res.json({ message: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
