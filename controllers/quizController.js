const Quiz = require("../models/QuizSechema");
const parseCSVFile = require("../utils/parseCSVFile");
const Enrollment = require("../models/StudentEnrollment");

exports.getAllQuizzes = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === "teacher") {
      filter.createdBy = req.user.id;
    } else if (req.user.role === "student") {
      const enrollments = await Enrollment.find({ student: req.user._id }).select("teacher");
      const teacherIds = enrollments.map((e) => e.teacher).filter(Boolean);
      if (teacherIds.length === 0) {
        return res.json([]);
      }
      filter.createdBy = { $in: teacherIds };
    }

    const quizzes = await Quiz.find(filter);
    return res.json(quizzes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.viewQuizTeachers = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    res.json(quiz);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createQuiz = async (req, res) => {
  try {
    if (req.user.role !== "teacher")
      return res
        .status(403)
        .json({ message: "Only teacher can create quizzes" });

    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const questions = await parseCSVFile(req.file.path);

    let { title, customQuestions } = req.body;

    if (customQuestions) {
      if (typeof customQuestions === "string") {
        try {
          customQuestions = JSON.parse(customQuestions);
        } catch {
          customQuestions = [customQuestions]; // fallback: wrap in array
        }
      }
      if (!Array.isArray(customQuestions)) customQuestions = [customQuestions];

      customQuestions = customQuestions.map((q) =>
        typeof q === "string" ? q : JSON.stringify(q)
      );
    }

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
        .json({ message: "Only teachers can update quizzes" });

    let { title, questions, customQuestions } = req.body;

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    if (quiz.createdBy.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "Not authorized to update this quiz" });

    if (title) quiz.title = title;

    if (customQuestions) {
      if (typeof customQuestions === "string") {
        try {
          customQuestions = JSON.parse(customQuestions);
        } catch {
          customQuestions = [customQuestions];
        }
      }
      if (!Array.isArray(customQuestions)) customQuestions = [customQuestions];

      quiz.customQuestions = customQuestions.map((q) =>
        typeof q === "string" ? q : JSON.stringify(q)
      );
    }

    if (req.file) {
      const parsedQuestions = await parseCSVFile(req.file.path);
      quiz.questions = parsedQuestions;
    } else if (questions) {
      if (typeof questions === "string") {
        try {
          questions = JSON.parse(questions);
        } catch {
          questions = [];
        }
      }
      if (Array.isArray(questions)) {
        quiz.questions = questions;
      }
    }

    await quiz.save();

    res.json({ message: "Quiz updated successfully", quiz });
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

exports.getQuizForStudents = async (req, res) => {
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
