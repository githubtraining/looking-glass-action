class FeedbackMessages {
  constructor(user) {
    this.user = user;
  }
}

class IssueFeedback extends FeedbackMessages {
  constructor(user) {
    super(user);
  }
  success(msg) {
    return `# Feedback for ${this.user}\n${msg}\n\nThanks for completing the lab!`;
  }

  failure(err) {
    return `# ${this.user} It looks like you performed an action we didn't expect. 😦\n**We expected:**\n ${err.expected}\n**We received:**\n ${err.got}. Try performing the expected action.`;
  }

  error(err) {
    return `# ${err.name}\n${
      err.userMessage
    }\n**payload details:**\n\`\`\`${JSON.stringify(err.payload)}\`\`\``;
  }
}

class ActionsFeedback extends FeedbackMessages {
  constructor(user) {
    super(user);
  }
  success(msg) {
    return `Feedback for ${this.user}\n${msg}\n\nThanks for completing the lab!`;
  }

  failure(err) {
    return `${this.user} It looks like you performed an action we didn't expect. 😦\nWe expected:\n ${err.expected}\nWe received:\n ${err.got}. Try performing the expected action.`;
  }

  error(err) {
    return {
      name: err.name,
      userMessage: err.userMessage,
      payload: err.payload,
    };
  }
}
module.exports = { IssueFeedback, ActionsFeedback };
