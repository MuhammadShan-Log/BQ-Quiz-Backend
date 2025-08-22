const mongoose = require("mongoose");

const campusSchema = new mongoose.Schema({
  name: String,
  location: String
});

module.exports = mongoose.model("Campus", campusSchema);
