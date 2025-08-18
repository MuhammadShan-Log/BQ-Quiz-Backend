const fs = require("fs");
const { parse } = require("csv-parse");

async function parseCSVFile(filePath, delimiter = ",") {
  const questions = [];

  const parser = fs
    .createReadStream(filePath)
    .pipe(parse({ columns: true, trim: true, delimiter }));

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

  await fs.promises.unlink(filePath);

  return questions;
}

module.exports = parseCSVFile;
