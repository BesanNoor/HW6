//ביסאם פרח 211861208
//נור צובח 214459463
// תכנית, המגדירה שמות של 3 קבצי קלט ומעתיקה תוכנם לקובץ חדש באופן הבא:
// שורה אחת מקובץ ראשון
// שורה אחת מקובץ שני
// שורה אחת מקובץ שלישי
// 2 שורות מקובץ ראשון
// 2 שורות מקובץ שני
// 2 שורות מקובץ שלילי
// .
// .
// .
// i שורות מקובץ ראשון
// i שורות מקובץ שני
// i שורות מקובץ שלישי

// אם אחד הקבצים קצר מאחרים – ממשיכים לעתיק מקבצים האחרים.
const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "text");
const outputFile = path.join(__dirname, "text/output.txt");

if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);

//const fileNames = ["1.txt.txt", "2.txt.txt", "3.txt.txt"];
let fileNames = fs.readdirSync(folderPath);
fileNames = fileNames.filter((f) => f.endsWith(".txt") && f !== "output.txt");

function readLinesKeep(text) {
  const arr = text.split(/\r?\n/);
  if (arr.length && arr[arr.length - 1] === "") arr.pop();
  return arr;
}

const files = fileNames.map((name) => {
  const p = path.join(folderPath, name);
  if (!fs.existsSync(p)) {
    console.log(`The file ${name} doesn't exist in folder "text"`);
    return { name, lines: [], idx: 0 };
  }
  const content = fs.readFileSync(p, "utf8");
  return { name, lines: readLinesKeep(content), idx: 0 };
});

function copyUpTo(file, count, sink) {
  if (file.idx >= file.lines.length) return 0;
  const start = file.idx;
  const end = Math.min(file.idx + count, file.lines.length);
  let chunk = "";
  for (let i = start; i < end; i++) chunk += file.lines[i] + "\n";
  sink(chunk);
  file.idx = end;
  return end - start;
}

let step = 1;
while (files.some((f) => f.idx < f.lines.length)) {
  for (const f of files) {
    copyUpTo(f, step, (chunk) => fs.appendFileSync(outputFile, chunk));
  }
  step++;
}

console.log("The output file created successfully");

