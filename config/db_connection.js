const mongoose = require('mongoose')
const debug = require('debug')("Development:DBConnection")
mongoose.connect(process.env.MONGO_URI)
.then(()=>debug('MongoDB connected successfully'))
.catch(err=>console.error(err))



module.exports = mongoose.connection;
