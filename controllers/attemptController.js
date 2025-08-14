
const Attempt = require("../models/Attempt");
const Quiz = require("../models/QuizSechema");

exports.submitQuiz = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit quizzes" });
    }

    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId).select("+questions.correctAnswer");

    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let score = 0;
    answers.forEach(ans => {
      const question = quiz.questions.id(ans.questionId);
      if (question && question.correctAnswer === ans.selectedOption) {
        score++;
      }
    });

    const attempt = await Attempt.create({
      quizId,
      studentId: req.user.id,
      answers,
      score
    });

    res.json({ message: "Quiz submitted", score, total: quiz.questions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
