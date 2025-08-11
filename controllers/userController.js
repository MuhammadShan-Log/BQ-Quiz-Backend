const User = require("../models/User");
const jwt = require('jsonwebtoken')

const generateToken =  (userId, role) => {
    return jwt.sign({user: userId, role}, process.env.SECRET, {expiresIn: '1d'})
}

exports.register = async (req,res) => {
    try {
        const { name, email, password, role } = req.body
        const existUser = await User.findOne({email})
        if(existUser) return res.status(400).json({error: 'Email Already Registered!'})
        const user = await User.create({name, email, password, role})
        const token = generateToken(user._id, user.role)
        res.status(201).json({user: {id: user._id, name: user.name, email: user.email, role: user.role}, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

exports.login = async (req,res) => {
    try {
        const { email, password, role } = req.body;
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({error: "Invalid email OR password"})
        const isMatch = await user.comparePassword(password)
        if(!isMatch) return res.status(400).json({error: 'Invalid email OR password'})
        const token = generateToken(user._id, user.role)
        res.json({user: {id: user._id, name: user.name, email: user.email, role: user.role}, token})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

exports.getAllUsers = async (req,res) => {
    const users = await User.find({}, '-password')
    res.json(users)
}
exports.getUserById = async (req,res) => {
    const { id } = req.params;
    const user = await User.findById(id, '-password')
    if(!user) return res.status(404).json({error: 'User not found'})
    
    if(req.user.role !== 'admin' && req.user.user !== user._id.toString()) return res.status(403).json({error: 'Permission denied'})
    res.json(user)
}
exports.updateRole = async (req,res) => {
    const { role } = req.user
    const updated = await User.findByIdAndUpdate(
        req.params.id,
        {role},
        {new:true}
    ).select('-password')
    res.json(updated)
}
exports.deleteUserById = async (req,res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) return res.status(404).json({error: 'User does not exists'})
        res.json({message: "User got deleted"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}