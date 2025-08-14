// models/Quiz.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: {
    a: String,
    b: String,
    c: String,
    d: String
  },
  correctAnswer: { type: String, required: true, select: false } 
  
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // teacher id
});

module.exports = mongoose.model("Quiz", quizSchema);
