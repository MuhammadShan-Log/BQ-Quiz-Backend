const mongoose = require("mongoose");

const teacherAssignmentSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    campus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campus",
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

teacherAssignmentSchema.index(
  { teacher: 1, course: 1, campus: 1 },
  { unique: true }
);

const TeacherAssignment = mongoose.model("TeacherAssignment", teacherAssignmentSchema);
module.exports = TeacherAssignment;
