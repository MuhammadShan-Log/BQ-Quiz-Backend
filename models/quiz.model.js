const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String }], // can be empty for coding-type questions
  correctAnswerIndex: { type: Number }, // optional for non-mcq
  marks: { type: Number, default: 1 }
}, { _id: true });

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: false },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  timeLimitMinutes: { type: Number, default: 0 },
  totalMarks: { type: Number, default: 0 },
  questions: [questionSchema],
  status: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

quizSchema.pre('save', function(next){
  this.totalMarks = (this.questions || []).reduce((s,q) => s + (q.marks || 1), 0);
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);
