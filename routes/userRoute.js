const { register, login, getAllUser, updateProfile } = require('../controllers/userController')
const express = require('express')
const validate = require('../middlewares/validate')
const { userValidation } = require('../validators/auth')
const router = express.Router()

router.post('/register', validate(userValidation), register)
router.post('/login', login)
router.get('/users/:role', getAllUser)
router.patch('/updateprofile/:id', updateProfile)

module.exports = router