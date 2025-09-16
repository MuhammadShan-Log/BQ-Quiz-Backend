const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.SECRET, {
    expiresIn: "1d",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    if (role === "admin" && (!req.user || req.user.role !== "admin")) {
      return res.status(403).json({ error: "Only admin can create admins" });
    }

    // if (["teacher", "student"].includes(role) && (!req.user || req.user.role !== "admin")) {
    //   return res.status(403).json({ error: "Only admin can register teachers/students" });
    // }

    const existUser = await User.findOne({ email });
    if (existUser) return res.status(400).json({ error: "Email already registered!" });

    let user = await User.create({ name, phone, email, password, role });

    return res.status(201).json({ message: "User created successfully", user });
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

exports.getAllStudents = async (req, res) => {
  try {
    if (req.user.role === "teacher") {
      const enrollments = await StudentEnrollment.find({ teacher: req.user._id })
        .populate("student", "name email phone")
      return res.json({ status: 200, data: enrollments.map(e => e.student) });
    }
    
    const students = await User.find({ role: "student" });
    return res.json({ status: 200, data: students });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
    return res.json(teachers)
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

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

