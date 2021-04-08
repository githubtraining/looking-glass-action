class CustomError extends Error {
  constructor(message) {
    super(message);
    this.userMessage =
      "Oops, looks like something isn't working right.  This is most likely not your fault!  Please open an issue in this lab's template repository!";
  }
}
class ValueError extends CustomError {
  constructor(message) {
    super(message);
    this.name = "ValueError";
  }
}
class SchemaError extends CustomError {
  constructor() {
    super();
    this.message =
      "Feedback Payload failed to validate against desired schema.  Make sure all required fields are present and all values are of the proper data type.";
    this.name = "SchemaError";
  }
}

class ServiceError extends CustomError {
  constructor(payload) {
    super();
    this.message =
      "There was a problem with the GitHub service or resource this action is attempting to use.";
    this.name = "ServiceError";
    this.payload = payload;
  }
}

module.exports = { ValueError, SchemaError, ServiceError };
