// seed/seedQuiz.js
require('dotenv').config();
const mongoose = require('mongoose');
const Quiz = require('../models/quiz.model');

const quizzes = [
  {
    title: 'JavaScript Basics',
    questions: [
      {
        questionText: 'What is JS?',
        options: ['Language', 'Framework', 'Database'],
        answer: 'Language'
      },
      {
        questionText: 'Which keyword declares a variable?',
        options: ['var', 'let', 'const', 'all of the above'],
        answer: 'all of the above'
      }
    ]
  },
  {
    title: 'HTML Fundamentals',
    questions: [
      {
        questionText: 'What does HTML stand for?',
        options: [
          'Hyper Text Markup Language',
          'Home Tool Markup Language',
          'Hyperlinks and Text Markup Language'
        ],
        answer: 'Hyper Text Markup Language'
      }
    ]
  }
];

const seedQuizzes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Quiz.deleteMany();
    console.log('🗑 Existing quizzes removed');

    await Quiz.insertMany(quizzes);
    console.log('✅ Sample quizzes inserted');

    mongoose.connection.close();
    console.log('📦 Database connection closed');
  } catch (err) {
    console.error('❌ Seeding error:', err);
    mongoose.connection.close();
  }
};

seedQuizzes();
