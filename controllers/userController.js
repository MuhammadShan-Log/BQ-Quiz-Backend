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
    const existUser = await User.findOne({ email });
    if (existUser)
      return res.status(400).json({ error: "Email Already Registered!" });
    const user = await User.create({ name, phone, email, password, role });
    const token = generateToken(user._id, user.role);
    return res
      .status(201)
      .json({
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
