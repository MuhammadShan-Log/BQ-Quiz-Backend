const mongoose = require('mongoose')

const courseSchema = mongoose.Schema({

    courseName: {
        type: String,
        required: [true, "Course name is required."],
    },
    courseDescription: {
        type: String,
        required: [true, "Course description is required"]
    },
    
    courseCode: {
        type: String,
        required: [true, "Course code is required."],
    },
    timings: {
        type: String,
        required: [true, "Course timings is required."],
    },
    days: {
        type: String,
        required: [true, "Course days is required."],
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Course createdby user is required."],
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    students: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    status: {
        type: Boolean,
        required: [true, "Course status is required."],
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })

const courseModel = mongoose.model('Course', courseSchema)
module.exports = courseModel