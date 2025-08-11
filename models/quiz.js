const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    isTextarea: { type: Boolean, default: false },
    options: [{ type: String }],
    correctOption: { type: Number },
    correctAnswer: { type: String },
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    timeDuration: { type: Number, required: true }, // in minutes
    quizKey: { type: String, required: true },
    questions: [questionSchema],
  },
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
