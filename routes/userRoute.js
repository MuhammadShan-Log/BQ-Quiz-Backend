const { register, login, getAllUsers, getUserById, updateRole, deleteUserById } = require('../controllers/userController')
const express = require('express')
const userAuthentication = require('../middlewares/authentication')
const validate = require('../middlewares/validate')
const { userValidation } = require('../validators/auth')
const authValidate = require('../middlewares/authValidate')
const router = express.Router()

router.post('/register', validate(userValidation), register)
router.post('/login', login)
router.get('/users', userAuthentication, authValidate('admin', 'manager'), getAllUsers)
router.get('/users/:id', userAuthentication, authValidate('admin', 'user'), getUserById)
router.patch('/users/:id/:role', userAuthentication, authValidate('admin'), updateRole)
router.delete('/users/:id', userAuthentication, authValidate('admin'), deleteUserById)

module.exports = router