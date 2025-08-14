const courseModel = require("../models/Course");

async function getAllCourses(req, res, next) {
  try {
    const data = await courseModel.find({});
    if (data) {
      return res.json({
        status: 200,
        message: "All courses are fetched.",
        data: data,
        error: null,
      });
    } else {
      return res.json({
        status: 404,
        message: "No courses found.",
        data: null,
        error: null,
      });
    }
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
    if (data) {
      return res.json({
        status: 200,
        message: "Course is added.",
        data: data,
        error: null,
      });
    } else {
      return res.json({
        status: 400,
        message: "Course is not added.",
        data: null,
        error: null,
      });
    }
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}
async function getCourseById(req, res, next) {
  try {
    const courseId = req.params.id;
    const data = await courseModel.findById(courseId);
    if (data) {
      return res.json({ status: 200, message: "Course is found.", data: data, error: null });
    } else {
      return res.json({ status: 404, message: "Course not found.", data: null, error: null });
    }
  } catch (error) {
    return res.json({ status: 500, error: "Server error." });
  }
}
async function updateCourseById(req, res, next) {
  try {
    const data = await courseModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (data) {
      return res.json({ status: 200, message: "Course is updated.", data: data, error: null });
    } else {
      return res.json({ status: 400, message: "Course not updated.", data: null, error: null });
    }
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
    if (data) {
      return res.json({ status: 200, message: "Course is deleted.", data: data, error: null });
    } else {
      return res.json({ status: 404, message: "Course is not deleted.", data: null, error: null });
    }
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
