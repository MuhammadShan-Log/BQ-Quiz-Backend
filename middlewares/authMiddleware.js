
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    console.log("JWT Error:", err);
    
    res.status(401).json({ message: "Token invalid" });
  }
};
