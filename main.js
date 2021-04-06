const core = require("@actions/core");
const github = require("@actions/github");
const LookingGlass = require("./lib/lookingGlass");

async function run() {
  try {
    const feedBack = core.getInput("feedback");
    if (!feedBack) return;

    const lookingGlass = new LookingGlass(JSON.parse(feedBack));

    const reports = lookingGlass.validatePayloadSignature();
    console.log(reports);

    for (const report of reports) {
      switch (report.display_type) {
        case "issues":
          const {
            payload,
            res,
          } = await lookingGlass.provideFeedbackUsingIssues(report);
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
    console.log(error);
  }
}

run();
