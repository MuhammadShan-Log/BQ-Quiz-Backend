const express = require('express')
const { getAllCourses, addNewCourse, getCourseById, updateCourseById, deleteCourseById } = require('../controllers/courseController')
const validate = require('../middlewares/validate')
const { courseValidation } = require('../validators/courseAuth')
const router = express.Router()

router.route('/')
    .get(getAllCourses)
    .post(validate(courseValidation), addNewCourse)

router.route('/:id')
    .get(getCourseById)
    .post(updateCourseById)
    .delete(deleteCourseById)

module.exports = router
