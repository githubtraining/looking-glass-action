const core = require("@actions/core");

const { ServiceError, DisplayTypeError } = require("./lib/customErrors");
const LookingGlass = require("./lib/lookingGlass");

async function run() {
  try {
    const feedBack = core.getInput("feedback");
    if (!feedBack) {
      core.setFailed(
        "No feedback payload was provided by a previous action, please view the documentation for using the Looking Glass at https://github.com/githubtraining/looking-glass-action"
      );
    }

    const lookingGlass = new LookingGlass(JSON.parse(feedBack));

    const reports = lookingGlass.validatePayloadSignature();

    if (reports.length < 1) {
      core.setFailed(
        "No reports were found in the feedback payload, please view the documentation for using the Looking Glass at https://github.com/githubtraining/looking-glass-action"
      );
    }

    for (const report of reports) {
      switch (report.display_type) {
        case "issues":
          const {
            payload,
            res,
          } = await lookingGlass.provideFeedbackUsingIssues(report);
          console.log(res);

          if (res.status !== 201) {
            throw new ServiceError(res);
          }

          break;
        case "actions":
          const err = lookingGlass.provideFeedbackUsingActions(report);
          if (err !== undefined) {
            throw new ServiceError(report.error);
          }
          break;
        default:
          throw new DisplayTypeError();
      }
    }
  } catch (error) {
    // use actions to throw author errors in actions.debug
    // log to learner with core.log that error happened and isn't on them
    if (
      error.name === "SchemaError" ||
      error.name === "ValueError" ||
      error.name === "ServiceError" ||
      error.name === "DisplayTypeError"
    ) {
      core.debug(JSON.stringify(error));
      core.setFailed(error.userMessage);
      return;
    }

    core.setFailed(error);
  }
}

run();
