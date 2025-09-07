const fs = require("fs");
const { parse } = require("csv-parse");

async function parseCSVFile(filePath, delimiter = ",") {
  const questions = [];
  let parser;

  try {
    parser = fs.createReadStream(filePath).pipe(parse({ columns: true, trim: true, delimiter }));

    for await (const row of parser) {
      questions.push({
        questionText: row.questionText,
        options: {
          a: row.optionA,
          b: row.optionB,
          c: row.optionC,
          d: row.optionD,
        },
        correctAnswer: row.correctAnswer,
      });
    }

    return questions;
  } finally {
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`Cleaned up uploaded file: ${filePath}`);
    }
  }
}

module.exports = parseCSVFile;
