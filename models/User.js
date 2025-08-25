const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
 
    name: {
        type: String,
        required: [true, "Name is required."]
    },
    phone: {
        type: String,
        required: [true, "Phone is required."],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true
    },
    role: {
        type: String,
        enum: ['teacher', 'student', 'admin'],
        default: 'student'
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = async function (candidatePw) {
    return await bcrypt.compare(candidatePw, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User