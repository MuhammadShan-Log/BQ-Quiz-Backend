const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {type:String, required: true},
    email: {type:String, required:true, unique: true},
    password: {type:String, required:true},
    role: {type:String, enum:['teacher', 'student'], default: 'student'},
    createdAt: {type:Date, default:Date.now}
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = async function(candidatePw){
    return await bcrypt.compare(candidatePw, this.password)
}

const User = mongoose.model('User', userSchema)
module.exports = User