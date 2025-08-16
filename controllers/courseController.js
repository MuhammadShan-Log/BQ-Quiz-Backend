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
    const data = await courseModel.create(req.body);
    return res.json({ status: 200, message: "", data: data, error: null });
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}
async function getCourseById(req, res, next) {
  try {
    const data = await courseModel.find(req.params.id);
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
    const data = await courseModel.findByIdAndDelete(req.params.id);
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
