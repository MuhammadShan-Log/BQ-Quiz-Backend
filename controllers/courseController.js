const courseModel = require("../models/Course");
const TeacherCourse = require("../models/TeacherCourse");
const Enrolment = require("../models/Enrolment");
const User = require("../models/User");

async function getAllCourses(req, res, next) {
  try {
    const data = await courseModel.find({});
    return res.json({ status: 200, message: "", data: data, error: null });
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}

async function addNewCourse(req, res, next) {
  try {
    const data = await courseModel.create(req.body);
    return res.json({ status: 200, message: "", data: data, error: null });
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}

async function getCourseById(req, res, next) {
  try {
    const data = await courseModel.find(req.params.id);
    return res.json({ status: 200, message: "", data: data, error: null });
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}

async function updateCourseById(req, res, next) {
  try {
    const data = await courseModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json({ status: 200, message: "", data: data, error: null });
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}

async function deleteCourseById(req, res, next) {
  try {
    const data = await courseModel.findByIdAndDelete(req.params.id);
    return res.json({ status: 200, message: "", data: data, error: null });
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}

// Assign teacher to course (Admin only)
async function assignTeacherToCourse(req, res, next) {
  try {
    const { courseId, teacherId, campusId } = req.body;

    // Check if course exists
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.json({ status: 404, error: "Course not found." });
    }

    // Check if teacher exists and has teacher role
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'teacher') {
      return res.json({ status: 400, error: "Invalid teacher ID or user is not a teacher." });
    }

    // Check if teacher is already assigned to this course
    const existingAssignment = await TeacherCourse.findOne({
      teacher: teacherId,
      course: courseId,
      campus: campusId
    });

    if (existingAssignment) {
      return res.json({ status: 400, error: "Teacher is already assigned to this course." });
    }

    // Create teacher-course assignment
    const teacherCourse = await TeacherCourse.create({
      teacher: teacherId,
      course: courseId,
      campus: campusId
    });

    // Update course with teacher
    await courseModel.findByIdAndUpdate(courseId, { teacher: teacherId });

    return res.json({ 
      status: 200, 
      message: "Teacher assigned to course successfully.", 
      data: teacherCourse, 
      error: null 
    });
  } catch (error) {
    console.error('Error assigning teacher to course:', error);
    return res.json({ status: 500, error: "Server error." });
  }
}

// Assign student to course (Admin only)
async function assignStudentToCourse(req, res, next) {
  try {
    const { studentId, courseId, campusId } = req.body;

    // Check if course exists and has a teacher
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.json({ status: 404, error: "Course not found." });
    }

    if (!course.teacher) {
      return res.json({ status: 400, error: "Course must have a teacher assigned first." });
    }

    // Check if student exists and has student role
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.json({ status: 400, error: "Invalid student ID or user is not a student." });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrolment.findOne({
      student: studentId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.json({ status: 400, error: "Student is already enrolled in this course." });
    }

    // Create enrollment
    const enrollment = await Enrolment.create({
      student: studentId,
      course: courseId,
      teacher: course.teacher,
      campus: campusId
    });

    return res.json({ 
      status: 200, 
      message: "Student enrolled to course successfully.", 
      data: enrollment, 
      error: null 
    });
  } catch (error) {
    console.error('Error enrolling student to course:', error);
    return res.json({ status: 500, error: "Server error." });
  }
}

// Student self-registration to course
async function studentSelfRegistration(req, res, next) {
  try {
    const { courseId, campusId } = req.body;
    const studentId = req.user.id; // From auth middleware

    // Check if course exists and has a teacher
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.json({ status: 404, error: "Course not found." });
    }

    if (!course.teacher) {
      return res.json({ status: 400, error: "Course must have a teacher assigned first." });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrolment.findOne({
      student: studentId,
      course: courseId
    });

    if (existingEnrollment) {
      return res.json({ status: 400, error: "You are already enrolled in this course." });
    }

    // Create enrollment
    const enrollment = await Enrolment.create({
      student: studentId,
      course: courseId,
      teacher: course.teacher,
      campus: campusId
    });

    return res.json({ 
      status: 200, 
      message: "Successfully enrolled to course.", 
      data: enrollment, 
      error: null 
    });
  } catch (error) {
    console.error('Error in student self-registration:', error);
    return res.json({ status: 500, error: "Server error." });
  }
}

// Get teacher's students (Teacher only)
async function getTeacherStudents(req, res, next) {
  try {
    const teacherId = req.user.id; // From auth middleware

    // Get all enrollments where this teacher is assigned
    const enrollments = await Enrolment.find({ teacher: teacherId })
      .populate('student', 'name email phone')
      .populate('course', 'courseName courseCode')
      .populate('campus', 'name');

    return res.json({ 
      status: 200, 
      message: "", 
      data: enrollments, 
      error: null 
    });
  } catch (error) {
    console.error('Error getting teacher students:', error);
    return res.json({ status: 500, error: "Server error." });
  }
}

// Get student's courses (Student only)
async function getStudentCourses(req, res, next) {
  try {
    const studentId = req.user.id; // From auth middleware

    // Get all enrollments for this student
    const enrollments = await Enrolment.find({ student: studentId })
      .populate('course', 'courseName courseCode courseDescription timings days')
      .populate('teacher', 'name email')
      .populate('campus', 'name');

    return res.json({ 
      status: 200, 
      message: "", 
      data: enrollments, 
      error: null 
    });
  } catch (error) {
    console.error('Error getting student courses:', error);
    return res.json({ status: 500, error: "Server error." });
  }
}

// Get courses by teacher (Teacher only)
async function getCoursesByTeacher(req, res, next) {
  try {
    const teacherId = req.user.id; // From auth middleware

    // Get all courses assigned to this teacher
    const courses = await courseModel.find({ teacher: teacherId })
      .populate('createdBy', 'name');

    return res.json({ 
      status: 200, 
      message: "", 
      data: courses, 
      error: null 
    });
  } catch (error) {
    console.error('Error getting teacher courses:', error);
    return res.json({ status: 500, error: "Server error." });
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
  getCoursesByTeacher
};
