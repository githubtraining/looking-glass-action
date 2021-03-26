const { Feedback } = require("./lib/feedback");
const data =
  '{"reports":[{"filename":"bread","isCorrect": true,"level": "fatal"},{"filename":"crumbs","isCorrect": false,"level": "warning"}]}';

const { reports } = JSON.parse(data);

const feedback = new Feedback(...reports);
// feedback.createIssue("hello");
console.log(feedback);

for (const report of feedback.reports) {
  console.log(report.level);
}
