const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign({ user: userId, role }, process.env.SECRET, {
    expiresIn: "1d",
  });
};

exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, role, enrollmentCourseID } = req.body;

    const userData = {
      name: name,
      phone: phone,
      email: email,
      password: password,
      role: role,
      enrollmentCourseID: enrollmentCourseID || null,
      status: role == "student" ? true : false,
    };
    console.log(userData)

    const existUser = await User.findOne({ email });

    if (existUser) {
      return res.status(400).json({ error: "Email Already Registered!" });
    }

    const user = await User.create(userData);
    const data = user.toObject();
    delete data.password;

    const token = generateToken(data._id, data.role);

    return res.status(201).json({ user: data, token });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
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

exports.getAllUser = async (req, res) => {
  const role = req.params.role;
    try {
      const users = await User.find({ role }).select('-password');
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id; // target user id to update
    const loggedInUser = req.user; // assume you set req.user from auth middleware
    const { name, phone, email, password, status } = req.body;

    // check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Role based restrictions
    if (loggedInUser.role !== "admin") {
      // Teacher/Student can only update their own profile
      if (loggedInUser._id.toString() !== userId.toString()) {
        return res.status(403).json({ message: "You are not allowed to update other users" });
      }

      // Cannot set status themselves
      if (typeof status !== "undefined") {
        return res.status(403).json({ message: "You are not allowed to update status" });
      }
    } else {
      // Admin cannot change his own status
      if (loggedInUser._id.toString() === userId.toString() && typeof status !== "undefined") {
        return res.status(403).json({ message: "Admin cannot change own status" });
      }
    }

    // Update allowed fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (email) user.email = email;

    // Handle password change (separate form but same API route)
    if (password) {
      const hashedPw = await bcrypt.hash(password, 10);
      user.password = hashedPw;
    }

    // Admin can update status for other users
    if (loggedInUser.role === "admin" && typeof status !== "undefined") {
      user.status = status;
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
