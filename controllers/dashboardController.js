const Quiz = require("../models/QuizSechema");
const Enrolment = require("../models/Enrolment");
const Course = require("../models/Course");

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

    // Get course statistics
    const courseCount = await Course.countDocuments({ teacher: teacherId });
    const studentCount = await Enrolment.countDocuments({ teacher: teacherId });

    res.json({
      quizCount,
      questionCount,
      courseCount,
      studentCount
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

// Get student overview
exports.getStudentOverview = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res
        .status(403)
        .json({ message: "Only students can access this resource" });
    }

    const studentId = req.user.id;

    // Get enrolled courses count
    const enrolledCoursesCount = await Enrolment.countDocuments({ 
      student: studentId, 
      status: 'active' 
    });

    // Get recent enrollments
    const recentEnrollments = await Enrolment.find({ student: studentId })
      .populate('course', 'courseName courseCode')
      .populate('teacher', 'name')
      .sort({ enrollmentDate: -1 })
      .limit(5);

    res.json({
      enrolledCoursesCount,
      recentEnrollments
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student stats", error });
  }
};

// Get admin overview
exports.getAdminOverview = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can access this resource" });
    }

    // Get total counts
    const totalStudents = await Enrolment.distinct('student').countDocuments();
    const totalTeachers = await Course.distinct('teacher').countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrolment.countDocuments();

    // Get courses without teachers
    const coursesWithoutTeachers = await Course.countDocuments({ teacher: null });

    res.json({
      totalStudents,
      totalTeachers,
      totalCourses,
      totalEnrollments,
      coursesWithoutTeachers
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin stats", error });
  }
};
