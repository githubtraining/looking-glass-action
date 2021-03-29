const core = require("@actions/core");
const github = require("@actions/github");
const LookingGlass = require("./lib/lookingGlass");

async function run() {
  try {
    const fb = core.getInput("feedback");
    if (!fb) return;

    const feedback = JSON.parse(fb);

    const lookingGlass = new LookingGlass(feedback);

    for (const report of lookingGlass.feedback.reports) {
      switch (report.display_type) {
        case "issues":
          lookingGlass.provideFeebackUsingIssues(report);
          break;
        default:
          console.log("default case");
          break;
      }
    }
  } catch (error) {
    core.setFailed(error);
  }
}

run();
