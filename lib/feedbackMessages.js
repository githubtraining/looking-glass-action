class FeedbackMessages {
  constructor(user) {
    this.user = user;
  }

  success(msg) {
    return `# Step feedback for ${this.user}\n${msg}** task!\n\n_please [provide feedback](some link for survey) for this lab_`;
  }

  failure(err) {
    return `# ${this.user} It looks like you have an error 😦\nWe expected: ${err.expected}\nWe received: ${err.got}`;
  }
}

// function success(user, stepName) {
//   return `Congratulations ${user}, you have successfully completed the ${stepName} task!`;
// }

module.exports = { FeedbackMessages };
