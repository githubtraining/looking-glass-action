const core = require("@actions/core");
const github = require("@actions/github");
const schema = require("./payloadSignature");

const { ValueError, SchemaError } = require("./customErrors");

// const token = core.getInput("github-token");
class LookingGlass {
  constructor(feedback) {
    this.token = core.getInput("github-token") || "none";
    this.octokit = github.getOctokit(this.token) || {};
    this.context = github.context || {};
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
    if (error) {
      throw new SchemaError();
    }

    for (const report of value.reports) {
      if (!report.msg) {
        report.msg = "Error";
      }

      if (
        report.msg === "Error" &&
        (!report.error.expected || !report.error.got)
      ) {
        throw new ValueError(
          "error.expected and error.got cannot be blank if msg is 'Error'"
        );
      }

      if (report.msg !== "Error" && !report.error.expected) {
        report.error.expected = null;
      }

      if (report.msg !== "Error" && report.error.got) {
        report.error.got = null;
      }
    }

    return value.reports;
  }
}
module.exports = LookingGlass;
