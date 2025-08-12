require('dotenv').config()
const cors = require('cors')

const express = require('express')
const app = express()

const authRoutes = require('./routes/userRoute')
const courseRoutes = require('./routes/courseRoute')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('MongoDB connected successfully'))
.catch(err=>console.error(err))

app.use(express.json())
app.use(cors())

app.use('/auth', authRoutes)
app.use('/course', courseRoutes)

const PORT = process.env.PORT
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))
