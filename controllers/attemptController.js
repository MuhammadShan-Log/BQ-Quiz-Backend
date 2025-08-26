const Attempt = require("../models/Attempt");
const Quiz = require("../models/QuizSechema");
const mongoose = require("mongoose");

exports.submitQuiz = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit quizzes" });
    }

    const { quizId, answers } = req.body;

    if (!quizId || !Array.isArray(answers)) {
      return res.status(400).json({ message: "quizId and answers are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: "Invalid quizId" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const correctById = new Map(
      (quiz.questions || []).map((q) => [String(q._id), q.correctAnswer])
    );

    let score = 0;
    for (const ans of answers) {
      const qid = String(ans?.questionId || "");
      const selected = ans?.selectedOption;
      const correct = correctById.get(qid);
      if (typeof selected === "string" && typeof correct === "string" && selected === correct) {
        score++;
      }
    }

    await Attempt.create({
      quiz: quizId,
      student: req.user.id,
      answers,
      score,
    });
    

    return res.json({ message: "Quiz submitted", score, total: quiz.questions.length });
  } catch (err) {
    console.error("submitQuiz error:", err);
    return res.status(500).json({ message: err.message });
  }
};


exports.getAttemptsForTeacher = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can view results" });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid teacher id" });
    }

    const teacherObjectId = new mongoose.Types.ObjectId(req.user.id);

    const quizzes = await Quiz.find({ createdBy: teacherObjectId }).select("_id");
    const quizIds = quizzes.map(q => q._id);

    if (quizIds.length === 0) {
      return res.json({ attempts: [] });
    }

    const attempts = await Attempt.find({ quiz: { $in: quizIds } })
      .populate({ path: "quiz", select: "title createdBy" })
      .populate("student", "name email")
      .lean();

    return res.json({ attempts });
  } catch (err) {
    console.error("getAttemptsForTeacher error:", err);
    return res.status(500).json({ message: err.message });
  }
};
