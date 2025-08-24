const { register, login, getProfile, getAllStudents, getAllTeachers, getUsersByRole } = require('../controllers/userController')
const express = require('express')
const validate = require('../middlewares/validate')
const { userValidation } = require('../validators/auth')
const { protect, authMiddleware } = require('../middlewares/authMiddleware')
const { getStudentWithCourse } = require("../controllers/userController");
const router = express.Router()

router.post('/register', validate(userValidation), register)
router.post('/login', login)
router.get('/profile', protect, getProfile)
router.get("/:id", getStudentWithCourse);

// FOR TEACHERS AND STUDENTS (Admin only)
router.get('/users/students', protect, authMiddleware(['admin', 'teacher']), getAllStudents)
router.get('/users/teachers', protect, authMiddleware(['admin']), getAllTeachers)
router.get('/users/role/:role', protect, authMiddleware(['admin']), getUsersByRole)

module.exports = router