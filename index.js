
const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const debug = require('debug')("Development:Server")
const authRoutes = require('./routes/userRoute')
const courseRoutes = require('./routes/courseRoute')
const db = require('./config/db_connection')

app.use(express.json())
app.use(cors())

app.use('/auth', authRoutes)
app.use('/course', courseRoutes)

const PORT = process.env.PORT
app.listen(PORT, ()=>debug(`Server running on port ${PORT}`))
