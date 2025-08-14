


const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId },
  selectedOption: String
});

const attemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: [answerSchema],
  score: Number
});

module.exports = mongoose.model("Attempt", attemptSchema);
