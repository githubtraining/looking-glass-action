const core = require("@actions/core");
const github = require("@actions/github");
const LookingGlass = require("./lib/lookingGlass");

async function run() {
  try {
    const feedBack = core.getInput("feedback");
    if (!fb) return;

    const lookingGlass = new LookingGlass(JSON.parse(feedBack));

    const reports = lookingGlass.validatePayloadSignature();

    for (const report of reports) {
      switch (report.display_type) {
        case "issues":
          lookingGlass.provideFeedbackUsingIssues(report);
          break;
        default:
          console.log("default case");
          break;
      }
    }
  } catch (error) {
    // use actions to throw author errors in actions.debug
    // log to learner with core.log that error happened and isn't on them
    if (error.name === "SchemaError" || error.name === "ValueError") {
      core.debug(JSON.stringify(error));
      core.setFailed(error.userMessage);
    }
  }
}

run();
