const courseModel = require("../models/Course");

async function getAllCourses(req, res, next) {
  try {
    const data = await courseModel.find({});
    return res.json({ status: 200, message: "", data: data, error: null });
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}
async function addNewCourse(req, res, next) {
  try {
    const {
      courseName,
      courseDescription,
      courseCode,
      timings,
      days,
      createdBy,
      status,
    } = req.body;

    const courseData = {
      courseName: courseName,
      courseDescription: courseDescription,
      courseCode: courseCode,
      timings: timings,
      days: days,
      createdBy: createdBy,
      status: status,
    };

    const data = await courseModel.create(courseData);

    return res.json({
      status: 200,
      message: "Course is added.",
      data: data,
      error: null,
    });
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}
async function getCourseById(req, res, next) {
  try {
    const courseId = req.params.id;
    const data = await courseModel.findById(courseId);
    return res.json({ status: 200, message: "", data: data, error: null });
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}
async function updateCourseById(req, res, next) {
  try {
    const data = await courseModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.json({ status: 200, message: "", data: data, error: null });
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}
async function deleteCourseById(req, res, next) {
  try {
    const data = await courseModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );
    return res.json({ status: 200, message: "", data: data, error: null });
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}

module.exports = {
  getAllCourses,
  addNewCourse,
  getCourseById,
  updateCourseById,
  deleteCourseById,
};
