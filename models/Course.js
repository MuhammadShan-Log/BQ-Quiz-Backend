const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "Course name is required."],
    },
    courseDescription: {
      type: String,
      required: [true, "Course description is required."],
    },
    courseCode: {
      type: String,
      required: [true, "Course code is required."],
      unique: true,
    },
    timings: {
      type: String,
      required: [true, "Course timings are required."],
    },
    days: {
      type: String,
      required: [true, "Course days are required."],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Course createdBy user is required."],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
