const mongoose = require("mongoose");

const campusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

const Campus = mongoose.model("Campus", campusSchema);
module.exports = Campus;
