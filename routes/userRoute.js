const { register, login, getProfile } = require('../controllers/userController')
const express = require('express')
const validate = require('../middlewares/validate')
const { userValidation } = require('../validators/auth')
const { protect } = require('../middlewares/authMiddleware')
const { getStudentWithCourse } = require("../controllers/userController");
const router = express.Router()

router.post('/register', validate(userValidation), register)
router.post('/login', login)
router.get('/profile',protect, getProfile)
router.get("/:id", getStudentWithCourse);


module.exports = router