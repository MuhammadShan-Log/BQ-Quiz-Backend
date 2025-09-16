const mongoose = require("mongoose");

const studentEnrollmentSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course",
    required: true,
  },
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true,
  },
  campus: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Campus",
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "completed", "dropped"],
    default: "active",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

studentEnrollmentSchema.index(
  { student: 1, course: 1, teacher: 1, campus: 1 }, 
  { unique: true }
);

const StudentEnrollment = mongoose.model("StudentEnrollment", studentEnrollmentSchema);
module.exports = StudentEnrollment;
