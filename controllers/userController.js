const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.SECRET, {
    expiresIn: "1d",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, role, enrollmentCourseID } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser)
      return res.status(400).json({ error: "Email Already Registered!" });

    const user = await User.create({ name, phone, email, password, role });

    if (user.role === "student" && enrollmentCourseID) {
      const course = await Course.findById(enrollmentCourseID);
      if (!course) {
        return res.status(400).json({ error: "Selected course not found." });
      }
      if (!course.teacher) {
        return res.status(400).json({ error: "Course must have a teacher assigned before enrollment." });
      }

      // Create enrollment if not already exists (unique index also protects)
      await Enrollment.create({
        student: user._id,
        course: course._id,
        teacher: course.teacher,
      });
    }

    const token = generateToken(user._id, user.role);
    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email OR password" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email OR password" });
    const token = generateToken(user._id, user.role);
    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (!req.user) return res.json({ error: "User Not Found!" });
    res.json(req.user);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};



exports.getStudentWithCourse = async (req, res) => {
  try {
    const userId = req.params.id; // frontend se bhejna hoga
    const student = await User.findById(userId).populate("enrollmentCourseID");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    return res.json({
      status: 200,
      data: student,
      error: null
    });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
}

// FOR FETCHING ALL STUDENTS TO ADMIN PAGE
exports.getAllStudents = async (req, res) => {
  try {
    let filter = { role: "student" }
    if (req.user.role === "teacher"){
      filter.enrollmentCourseID = req.user.enrollmentCourseID
    }
    const students = await User.find(filter)
    return res.json({
      status: 200,
      data: students,
      error: null
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// FOR FETCHING ALL TEACHERS TO ADMIN PAGE
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
    return res.json(teachers)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

// FOR FETCHING ALL USERS BY ROLE
exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;
    
    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }
    
    const users = await User.find({ role: role })
    return res.json({
      status: 200,
      data: users,
      error: null
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

