const core = require("@actions/core");
const github = require("@actions/github");
const { LookingGlass } = require("./lib/lookingGlass");

async function run() {
  try {
    const fb = core.getInput("feedback");
    if (!fb) return;

    const feedback = JSON.parse(fb);

    const token = core.getInput("github-token");
    const octokit = github.getOctokit(token);
    const context = github.context;
    const lookingGlass = new LookingGlass(octokit, context, feedback);

    for (const report of lookingGlass.feedback.reports) {
      switch (report.display_type) {
        case "issues":
          lookingGlass.provideFeebackUsingIssues(report);
          break;
        // case "pull_requests":
        //   feedback.createPullRequests(octokit, report.msg);
        //   break;
        default:
          console.log("default case");
          break;
      }
    }
    // if (report.type !== "actions") {
    //   // decide how to display feedback based on paylaod from reort.type
    //   const res = await octokit.issues.create({
    //     owner: github.context.repo.owner,
    //     repo: github.context.repo.repo,
    //     title: "Oh no!",
    //     labels: ["bug"],
    //     body: report.msg,
    //   });

    //   return;
    // }
    // if (report.level === "warning" || report.level === "fatal") {
    //   core.warning(report.msg);
    // } else {
    //   core.info(report.msg);
    // }
  } catch (error) {
    core.setFailed(error);
  }
}

run();
