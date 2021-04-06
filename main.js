const core = require("@actions/core");
const github = require("@actions/github");
const LookingGlass = require("./lib/lookingGlass");

async function run() {
  try {
    const fb = core.getInput("feedback");
    if (!fb) return;
    console.log(fb);
    // const feedback = JSON.parse(fb);
    // console.log(`json.parse(fb):\n${feedback} `);

    const lookingGlass = new LookingGlass(fb);
    console.log(`new LookingGlass(fb):\n${lookingGlass.feedback} `);

    const reports = lookingGlass.validatePayloadSignature();
    console.log(`lookingGlass.validatepayloadsig():\n${reports} `);

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
