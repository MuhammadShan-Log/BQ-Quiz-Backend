const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId },
  selectedOption: String
});

const attemptSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: [answerSchema],
  score: Number,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Attempt", attemptSchema);




// const mongoose = require("mongoose");

// const attemptSchema = mongoose.Schema({
//   student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
//   answers: [
//     {
//       questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz.questions" },
//       selectedOption: String,
//       isCorrect: Boolean
//     }
//   ],
//   score: { type: Number, required: true },
//   submittedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Attempt", attemptSchema);
