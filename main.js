const core = require("@actions/core");
const github = require("@actions/github");
const LookingGlass = require("./lib/lookingGlass");

async function run() {
  try {
    const feedBack = core.getInput("feedback");
    if (!fb) return;
    console.log("you have feedback");
    const lookingGlass = new LookingGlass(JSON.parse(feedBack));
    console.log("you have a new lg");

    const reports = lookingGlass.validatePayloadSignature();
    console.log(reports);

    for (const report of reports) {
      console.log(report);
      switch (report.display_type) {
        case "issues":
          console.log("type is issues");
          lookingGlass.provideFeedbackUsingIssues(report);
          // console.log("providing feedback via issue");
          // if res failed then throw a ServiceError (not created yet)
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
