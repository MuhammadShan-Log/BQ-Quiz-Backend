const Joi = require("joi");
const allowedLists = require("../constant/user");

exports.userValidation = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid(...allowedLists).optional()
})