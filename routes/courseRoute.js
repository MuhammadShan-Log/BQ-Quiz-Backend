const express = require('express')
const { 
  getAllCourses, 
  addNewCourse, 
  getCourseById, 
  updateCourseById, 
  deleteCourseById,
  assignTeacherToCourse,
  assignStudentToCourse,
  studentSelfRegistration,
  getTeacherStudents,
  getStudentCourses,
  getCoursesByTeacher
} = require('../controllers/courseController')
const validate = require('../middlewares/validate')
const { courseValidation } = require('../validators/courseAuth')
const { protect, authMiddleware } = require('../middlewares/authMiddleware')
const router = express.Router()

// Public routes
router.post("/",protect, validate(courseValidation), addNewCourse)
router.get('/', protect, getAllCourses)
router.get('/list', getAllCourses)

router.route('/:id')
    .get(getCourseById)
    .put(updateCourseById)
    .patch(deleteCourseById)

// Admin routes for course assignment
router.post('/assign-teacher', protect, authMiddleware(['admin']), assignTeacherToCourse)
router.post('/assign-student', protect, authMiddleware(['admin']), assignStudentToCourse)

// Teacher routes
router.get('/teacher/students', protect, authMiddleware(['teacher']), getTeacherStudents)
router.get('/teacher/courses', protect, authMiddleware(['teacher']), getCoursesByTeacher)

// Student routes
router.get('/student/courses', protect, authMiddleware(['student']), getStudentCourses)
router.post('/student/enroll', protect, authMiddleware(['student']), studentSelfRegistration)

module.exports = router
