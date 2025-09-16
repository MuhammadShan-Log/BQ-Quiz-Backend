const Course = require("../models/Course");
const StudentEnrollment = require("../models/StudentEnrollment");
const TeacherAssignment = require("../models/TeacherAssignment");
const User = require("../models/User");
const Campus = require("../models/Campus");

async function getAllCourses(req, res) {
  try {
    let filter = { isDeleted: false };

    const courses = await Course.find(filter)
      .populate("createdBy", "name email")
      .lean();

    return res.status(200).json({ status: 200, data: courses });
  } catch (error) {
    console.error("getAllCourses error:", error);
    return res.status(500).json({ error: "Server error." });
  }
}

async function addNewCourse(req, res) {
  try {
    const course = await Course.create(req.body);
    return res
      .status(200)
      .json({ message: "Course added successfully!", data: course });
  } catch (error) {
    console.error("addNewCourse error:", error);
    return res.status(500).json({ error: "Server error." });
  }
}

async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy", "name email")
      .lean();
    if (!course) return res.status(404).json({ error: "Course not found." });
    return res.status(200).json({ data: course });
  } catch (error) {
    console.error("getCourseById error:", error);
    return res.status(500).json({ error: "Server error." });
  }
}

async function updateCourseById(req, res) {
  try {
    const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Course not found." });
    return res
      .status(200)
      .json({ message: "Course updated successfully!", data: updated });
  } catch (error) {
    console.error("updateCourseById error:", error);
    return res.status(500).json({ error: "Server error." });
  }
}

async function deleteCourseById(req, res) {
  try {
    const deleted = await Course.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ error: "Course not found." });
    return res.status(200).json({ message: "Course deleted" });
  } catch (error) {
    console.error("deleteCourseById error:", error);
    return res.status(500).json({ error: "Server error." });
  }
}

async function assignTeacherToCourse(req, res) {
  try {
    const { courseId, teacherId, campusId } = req.body;

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(400).json({ error: "Invalid teacher ID." });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found." });

    const campus = await Campus.findById(campusId);
    if (!campus) return res.status(404).json({ error: "Campus not found." });

    const assignment = await TeacherAssignment.create({
      teacher: teacherId,
      course: courseId,
      campus: campusId,
    });

    return res
      .status(200)
      .json({ message: "Teacher assigned successfully!" });
  } catch (error) {
    console.error("assignTeacherToCourse error:", error);
    return res.status(500).json({ error: error.message });
  }
}

async function assignStudentToCourse(req, res) {
  try {
    const { studentId, courseId, teacherId, campusId } = req.body;

    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(400).json({ error: "Invalid student ID." });
    }

    const assignment = await TeacherAssignment.findOne({
      teacher: teacherId,
      course: courseId,
      campus: campusId,
      status: "active",
    });
    if (!assignment) {
      return res
        .status(400)
        .json({ error: "Teacher is not assigned to this course at this campus." });
    }

    const enrollment = await StudentEnrollment.create({
      student: studentId,
      course: courseId,
      teacher: teacherId,
      campus: campusId,
    });

    return res
      .status(200)
      .json({ message: "Student enrolled successfully!"});
  } catch (error) {
    console.error("assignStudentToCourse error:", error);
    return res.status(500).json({ error: error.message });
  }
}

async function getTeacherStudents(req, res) {
  try {
    const teacherId = req.user._id;
    const enrollments = await StudentEnrollment.find({ teacher: teacherId })
      .populate("student", "name email phone")
      .populate("course", "courseName courseCode")
      .populate("campus", "name location")
      .lean();

    return res.status(200).json({ data: enrollments });
  } catch (error) {
    console.error("getTeacherStudents error:", error);
    return res.status(500).json({ error: "Server error." });
  }
}

async function getStudentCourses(req, res) {
  try {
    const studentId = req.user._id;
    const enrollments = await StudentEnrollment.find({ student: studentId })
      .populate("course", "courseName courseCode courseDescription timings days")
      .populate("teacher", "name email")
      .populate("campus", "name location")
      .lean();

    return res.status(200).json({ data: enrollments });
  } catch (error) {
    console.error("getStudentCourses error:", error);
    return res.status(500).json({ error: "Server error." });
  }
}

async function getCoursesByTeacher(req, res) {
  try {
    const teacherId = req.user._id;
    const assignments = await TeacherAssignment.find({ teacher: teacherId })
      .populate("course", "courseName courseCode courseDescription")
      .populate("campus", "name location")
      .lean();

    return res.status(200).json({ data: assignments });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
  getTeacherStudents,
  getStudentCourses,
  getCoursesByTeacher       
};