// controllers/course.controller.js
const courseModel = require("../models/Course");
const TeacherCourse = require("../models/TeacherCourse");
const Enrolment = require("../models/Enrolment");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");

async function getAllCourses(req, res) {
  try {
    let filter = { isDeleted: false };

    if (req?.user?.role === "teacher") {
      filter.teacher = new mongoose.Types.ObjectId(req.user._id);
    }

    const data = await courseModel
      .find(filter)
      .populate("teacher", "name email")
      .lean();

    console.log("Courses found:", data);

    return res
      .status(200)
      .json({ status: 200, message: "", data, error: null });
  } catch (error) {
    console.error("getAllCourses error:", error);
    return res.status(500).json({ status: 500, error: "Server error." });
  }
}

async function addNewCourse(req, res) {
  try {
    const data = await courseModel.create(req.body);
    return res.status(200).json({
      status: 200,
      message: "Course added successfully!",
      data,
      error: null,
    });
  } catch (error) {
    console.error("addNewCourse error:", error);
    return res.status(500).json({ status: 500, error: "Server error." });
  }
}

async function getCourseById(req, res) {
  try {
    const data = await courseModel
      .findById(req.params.id)
      .populate("teacher", "name email")
      .lean();
    if (!data)
      return res.status(404).json({ status: 404, error: "Course not found." });
    return res
      .status(200)
      .json({ status: 200, message: "", data, error: null });
  } catch (error) {
    console.error("getCourseById error:", error);
    return res.status(500).json({ status: 500, error: "Server error." });
  }
}

async function updateCourseById(req, res) {
  try {
    const data = await courseModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data)
      return res.status(404).json({ status: 404, error: "Course not found." });
    return res.status(200).json({
      status: 200,
      message: "Course updated successfully!",
      data,
      error: null,
    });
  } catch (error) {
    console.error("updateCourseById error:", error);
    return res.status(500).json({ status: 500, error: "Server error." });
  }
}

async function deleteCourseById(req, res) {
  try {
    const data = await courseModel.findByIdAndDelete(req.params.id);
    if (!data)
      return res.status(404).json({ status: 404, error: "Course not found." });
    return res.status(200).json({
      status: 200,
      message: "Course deleted successfully.",
      data,
      error: null,
    });
  } catch (error) {
    console.error("deleteCourseById error:", error);
    return res.status(500).json({ status: 500, error: "Server error." });
  }
}

// Assign teacher to course (Admin only)
async function assignTeacherToCourse(req, res) {
  try {
    const { courseId, teacherId } = req.body;
    const course = await courseModel.findById(courseId);
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ error: "Invalid courseId or teacherId" });
    }
    if (!course) return res.status(404).json({ error: "Course Not Found!" });


    course.teacher = teacherId;
    await course.save();

    res.json({ message: "course Assigned successfully", course });
  } catch (error) {
    return res.status(500).json({ status: 500, error: "Server error." });
  }
}

// Assign student to course (Admin only)
async function assignStudentToCourse(req, res) {
  try {
    const { studentId, courseId } = req.body;

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ status: 404, error: "Course not found." });
    }

    if (!course.teacher) {
      return res.status(400).json({
        status: 400,
        error: "Course must have a teacher assigned first.",
      });
    }

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(400).json({
        status: 400,
        error: "Invalid student ID or user is not a student.",
      });
    }

    if (
      student.enrollmentCourseID &&
      student.enrollmentCourseID.toString() === courseId.toString()
    ) {
      return res.status(400).json({
        status: 400,
        error: "Student is already enrolled in this course.",
      });
    }

    student.enrollmentCourseID = courseId;
    await student.save();

    return res.status(200).json({
      status: 200,
      message: "Student enrolled to course successfully.",
      data: student,
      error: null,
    });
  } catch (error) {
    console.error("assignStudentToCourse error:", error);
    return res.status(500).json({ status: 500, error: "Server error." });
  }
}

// Student self-registration to course
async function studentSelfRegistration(req, res) {
  try {
    const { courseId, campusId } = req.body;
    const studentId = req.user.id;

    const course = await courseModel.findById(courseId);
    if (!course)
      return res.status(404).json({ status: 404, error: "Course not found." });

    if (!course.teacher) {
      return res.status(400).json({
        status: 400,
        error: "Course must have a teacher assigned first.",
      });
    }

    const existingEnrollment = await Enrolment.findOne({
      student: studentId,
      course: courseId,
    });
    if (existingEnrollment) {
      return res.status(400).json({
        status: 400,
        error: "You are already enrolled in this course.",
      });
    }

    const enrollment = await Enrolment.create({
      student: studentId,
      course: courseId,
      teacher: course.teacher,
      campus: campusId || null,
    });

    return res.status(200).json({
      status: 200,
      message: "Successfully enrolled to course.",
      data: enrollment,
      error: null,
    });
  } catch (error) {
    console.error("studentSelfRegistration error:", error);
    return res.status(500).json({ status: 500, error: "Server error." });
  }
}

// Get teacher's students (Teacher only)
async function getTeacherStudents(req, res) {
  try {
    const teacherId = req.user.id;
    const enrollments = await Enrolment.find({ teacher: teacherId })
      .populate("student", "name email phone")
      .populate("course", "courseName courseCode")
      .populate("campus", "name")
      .lean();

    return res
      .status(200)
      .json({ status: 200, message: "", data: enrollments, error: null });
  } catch (error) {
    console.error("getTeacherStudents error:", error);
    return res.status(500).json({ status: 500, error: "Server error." });
  }
}

// Get student's courses (Student only)
async function getStudentCourses(req, res) {
  try {
    const studentId = req.user.id;
    const enrollments = await Enrolment.find({ student: studentId })
      .populate(
        "course",
        "courseName courseCode courseDescription timings days"
      )
      .populate("teacher", "name email")
      .populate("campus", "name")
      .lean();

    return res
      .status(200)
      .json({ status: 200, message: "", data: enrollments, error: null });
  } catch (error) {
    console.error("getStudentCourses error:", error);
    return res.status(500).json({ status: 500, error: "Server error." });
  }
}

// Get courses by teacher (Teacher only)
async function getCoursesByTeacher(req, res) {
  try {
    const teacherId = req.user.id;
    const courses = await courseModel
      .find({ teacher: teacherId })
      .populate("createdBy", "name")
      .lean();

    return res
      .status(200)
      .json({ status: 200, message: "", data: courses, error: null });
  } catch (error) {
    console.error("getCoursesByTeacher error:", error);
    return res.status(500).json({ status: 500, error: "Server error." });
  }
}

module.exports = {
  getAllCourses,
  addNewCourse,
  getCourseById,
  updateCourseById,
  deleteCourseById,
  assignTeacherToCourse,
  assignStudentToCourse,
  studentSelfRegistration,
  getTeacherStudents,
  getStudentCourses,
  getCoursesByTeacher,
};
