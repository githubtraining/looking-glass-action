const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
    // {
    //   report: [
    //     {
    //       filename: "the filename associated with the report",
    //       isCorrect: true,
    //       level: "info",
    //       display_type: "actions",
    //       msg: "the message",
    //       error: {
    //         expected: "the expected string",
    //         got: "the gotten string",
    //       },
    //     },
    //     {
    //       filename: "",
    //       isCorrect: false,
    //       display_type: "issues",
    //       level: "fatal",
    //       msg: "the message",
    //       error: {
    //         expected: "",
    //         got: "",
    //       },
    //     },
    //   ];
    // }
    const fb = core.getInput("feedback");
    if (!fb) return;

    const report = JSON.parse(fb);

    const token = core.getInput("github-token");
    const octokit = github.getOctokit(token);

    if (report.type !== "actions") {
      // decide how to display feedback based on paylaod from reort.type
      const res = await octokit.issues.create({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        title: "Oh no!",
        labels: ["bug"],
        body: report.msg,
      });

      return;
    }
    if (report.level === "warning" || report.level === "fatal") {
      core.warning(report.msg);
    } else {
      core.info(report.msg);
    }
  } catch (error) {
    core.setFailed(error);
  }
}

run();
