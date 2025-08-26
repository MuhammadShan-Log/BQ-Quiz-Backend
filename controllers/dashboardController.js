const Quiz = require("../models/QuizSechema");
const Enrolment = require("../models/Enrollment");
const Course = require("../models/Course");
const User = require("../models/User");
const Attempt = require("../models/Attempt");

exports.getTeacherStats = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can access this resource" });
    }

    const teacherId = req.user.id;

    const totalQuizzes = await Quiz.countDocuments({ createdBy: teacherId });
    const quizzes = await Quiz.find({ createdBy: teacherId });

    const totalCourses = await Course.countDocuments({ teacher: teacherId });

    const teacherCourses = await Course.find({ teacher: teacherId }).select("_id");
    const courseIds = teacherCourses.map(c => c._id);
    const totalStudents = await Enrolment.countDocuments({ course: { $in: courseIds } });

    res.json({
      totalCourses,
      totalStudents,
      totalQuizzes,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching teacher stats", error });
  }
};

exports.getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrolments = await Enrolment.find({ student: studentId }).populate("course");
    const attemptedQuizzes = await Attempt.countDocuments({ student: studentId });

    res.json({
      status: 200,
      data: {
        enrolledCourses: enrolments.length,
        attemptedQuizzes,
      }
    });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({ isDeleted: false });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalEnrolments = await Enrolment.countDocuments();
    const totalQuizzes = await Quiz.countDocuments();

    res.json({
      status: 200,
      data: {
        totalCourses,
        totalStudents,
        totalTeachers,
        totalEnrolments,
        totalQuizzes
      }
    });
  } catch (error) {
    res.status(500).json({ status: 500, error: error.message });
  }
};
