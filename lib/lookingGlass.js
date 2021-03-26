const core = require("@actions/core");

class LookingGlass {
  constructor(octokit, context, ...reports) {
    this.octokit = octokit;
    this.context = context;
    this.reports = reports;
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
}
module.exports = { LookingGlass };
