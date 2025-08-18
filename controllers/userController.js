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
    try {
        const users = await User.find().select('-password');
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}