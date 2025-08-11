const { register, login } = require('../controllers/userController')
const express = require('express')
const validate = require('../middlewares/validate')
const { userValidation } = require('../validators/auth')
const router = express.Router()

router.post('/register', validate(userValidation), register)
router.post('/login', login)


module.exports = router