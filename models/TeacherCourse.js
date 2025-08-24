const mongoose = require("mongoose");

const teacherCourseSchema = new mongoose.Schema({
  teacher: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Course",
    required: true
  },
  campus: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Campus",
    required: true
  },
  assignedDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  }
}, { timestamps: true });

// Compound index to prevent duplicate teacher-course assignments
teacherCourseSchema.index({ teacher: 1, course: 1, campus: 1 }, { unique: true });

module.exports = mongoose.model("TeacherCourse", teacherCourseSchema);
