const mongoose = require("mongoose");

const teacherCourseSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  campus: { type: mongoose.Schema.Types.ObjectId, ref: "Campus" }
});

module.exports = mongoose.model("TeacherCourse", teacherCourseSchema);
