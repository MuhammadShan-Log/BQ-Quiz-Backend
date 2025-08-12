const express = require('express')
const { getAllCourses, addNewCourse, getCourseById, updateCourseById, deleteCourseById } = require('../controllers/courseController')
const router = express.Router()

router.route('/')
    .get(getAllCourses)
    .post(addNewCourse)

router.route('/:id')
    .get(getCourseById)
    .post(updateCourseById)
    .delete(deleteCourseById)

module.exports = router
