const Quiz = require("../models/QuizSechema");

exports.getTeacherOverview = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can access this resource" });
    }

    const teacherId = req.user.id;

    const quizCount = await Quiz.countDocuments({ createdBy: teacherId });

    const quizzes = await Quiz.find({ createdBy: teacherId });

    // count both normal questions and custom questions
    const questionCount = quizzes.reduce((acc, quiz) => {
      const normalQs = quiz.questions?.length || 0;
      const customQs = quiz.customQuestions?.length || 0;
      return acc + normalQs + customQs;
    }, 0);

    res.json({
      quizCount,
      questionCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching teacher stats", error });
  }
};

exports.getRecentQuizzes = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can access this resource" });
    }

    const teacherId = req.user.id;

    const recentQuizzes = await Quiz.find({ createdBy: teacherId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(recentQuizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent quizzes", error });
  }
};
