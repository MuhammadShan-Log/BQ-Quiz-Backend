// controllers/course.controller.js
const courseModel = require("../models/Course");
const Enrollment = require("../models/StudentEnrollment");
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
    const data = await courseModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!data)
      return res.status(404).json({ status: 404, error: "Course not found." });
    return res.status(200).json({
      status: 200,
      message: "Course deleted successfully (soft delete).",
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

    // Validate IDs FIRST to avoid cast errors
    if (!mongoose.Types.ObjectId.isValid(courseId) || !mongoose.Types.ObjectId.isValid(teacherId)) {
      return res.status(400).json({ error: "Invalid courseId or teacherId" });
    }

    const exists = await courseModel.exists({ _id: courseId });
    if (!exists) return res.status(404).json({ error: "Course Not Found!" });

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(400).json({ error: "Invalid teacher ID or user is not a teacher." });
    }

    // Atomic update without triggering full validation on unrelated required fields
    const updated = await courseModel.findByIdAndUpdate(
      courseId,
      { $set: { teacher: teacherId } },
      { new: true, runValidators: false }
    ).populate("teacher", "name email");

    return res.json({ message: "Course assigned successfully", course: updated });
  } catch (error) {
    console.error("assignTeacherToCourse error:", error);
    return res.status(500).json({ status: 500, error: error.message || "Server error." });
  }
}

// Assign student to course (Admin only)
async function assignStudentToCourse(req, res) {
  try {
    const { studentId, courseId, campusId } = req.body;

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

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });
    if (existingEnrollment) {
      return res.status(400).json({
        status: 400,
        error: "Student is already enrolled in this course.",
      });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      teacher: course.teacher,
      // campus: campusId || null,
    });

    return res.status(200).json({
      status: 200,
      message: "Student enrolled to course successfully.",
      data: enrollment,
      error: null,
    });
  } catch (error) {
    console.error("assignStudentToCourse error:", error);
    return res.status(500).json({ status: 500, error: error.message });
  }
}

// Student self-registration to course
async function studentSelfRegistration(req, res) {
  try {
    const { courseId, campusId } = req.body;
    const studentId = req.user._id;

    const course = await courseModel.findById(courseId);
    if (!course)
      return res.status(404).json({ status: 404, error: "Course not found." });

    if (!course.teacher) {
      return res.status(400).json({
        status: 400,
        error: "Course must have a teacher assigned first.",
      });
    }

    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });
    if (existingEnrollment) {
      return res.status(400).json({
        status: 400,
        error: "You are already enrolled in this course.",
      });
    }

    const enrollment = await Enrollment.create({
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
// Get teacher's students (Teacher only)
async function getTeacherStudents(req, res) {
  try {
    const teacherId = req.user._id;
    const enrollments = await Enrollment.find({ teacher: teacherId })
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
    const studentId = req.user._id;
    const enrollments = await Enrollment.find({ student: studentId })
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
    const teacherId = req.user._id;
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
