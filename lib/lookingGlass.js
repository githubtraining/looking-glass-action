const core = require("@actions/core");
const schema = require("./payloadSignature");

class LookingGlass {
  constructor(octokit, context, feedback) {
    this.octokit = octokit;
    this.context = context;
    this.feedback = feedback;
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
module.exports = { LookingGlass };
