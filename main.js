const core = require("@actions/core");
const github = require("@actions/github");

async function run() {
  try {
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
