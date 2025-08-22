const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  campus: { type: mongoose.Schema.Types.ObjectId, ref: "Campus" },
});

module.exports = mongoose.model("Enrollment", enrollmentSchema);
