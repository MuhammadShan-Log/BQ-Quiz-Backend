const Joi = require("joi");

exports.courseValidation = Joi.object({
    courseName: Joi.string().min(3).required(),
    courseDescription: Joi.string().min(5).required(),
    courseCode: Joi.string().required(),
    timings: Joi.string().required(),
    days: Joi.string().required(),
    createdBy: Joi.object().required(),
    status: Joi.boolean().required()
})