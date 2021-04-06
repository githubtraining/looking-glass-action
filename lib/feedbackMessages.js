class FeedbackMessages {
  constructor(user, surveyLink) {
    this.user = user;
    this.surveyLink = surveyLink;
  }

  success(msg) {
    return `# Step feedback for ${this.user}\n${msg}** task!\n\n_please [provide feedback](${this.surveyLink}) for this lab_`;
  }

  failure(err) {
    return `# ${this.user} It looks like you have an error 😦\n**We expected:**\n ${err.expected}\n**We received:**\n ${err.got}`;
  }
}

module.exports = { FeedbackMessages };
