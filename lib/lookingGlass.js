const core = require("@actions/core");
const github = require("@actions/github");
const schema = require("./payloadSignature");

const token = core.getInput("github-token") || "none";
class LookingGlass {
  constructor(feedback) {
    this.octokit = github.getOctokit(token) || {};
    this.context = github.context || {};
    this.feedback = feedback || {};
  }

  async provideFeebackUsingIssues(report) {
    const msg = report.msg !== "Error" ? report.msg : report.error;
    const res = await this.octokit.issues.create({
      owner: this.context.repo.owner,
      repo: this.context.repo.repo,
      title: "Oh no!",
      labels: ["bug"],
      body: `${msg}`,
    });
  }

  forceWorkflowToFail() {
    core.setFailed("Should reflect failure");
  }

  getReportLevel(report) {
    return report.level;
  }

  validatePayloadSignature() {
    const { error, value } = schema.validate(this.feedback);
    return { error, value };
  }
}
module.exports = LookingGlass;
