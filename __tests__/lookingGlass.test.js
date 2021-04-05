const LookingGlass = require("../lib/lookingGlass");

describe("Looking Glass Methods", () => {
  let lookingGlass;
  let baseFeedback = {
    reports: [
      {
        filename: "the filename associated with the report",
        isCorrect: true,
        level: "info",
        display_type: "actions",
        msg: "",
        error: {
          expected: "the expected string",
          got: "the gotten string",
        },
      },
    ],
  };

  beforeEach(() => {
    lookingGlass = new LookingGlass(baseFeedback);
  });

  describe("validatePayloadSignature method tests", () => {
    it("Should return an array of reports if the payload matches the signature schema", () => {
      const feedback = {
        reports: [
          {
            filename: "the filename associated with the report",
            isCorrect: true,
            level: "info",
            display_type: "actions",
            msg: "",
            error: {
              expected: "the expected string",
              got: "the gotten string",
            },
          },
          {
            filename: "",
            isCorrect: false,
            display_type: "issues",
            level: "fatal",
            msg: "the message",
            error: {
              expected: "",
              got: "",
            },
          },
        ],
      };

      const validatedReports = [
        {
          filename: "the filename associated with the report",
          isCorrect: true,
          level: "info",
          display_type: "actions",
          msg: "Error",
          error: {
            expected: "the expected string",
            got: "the gotten string",
          },
        },
        {
          filename: "noFile",
          isCorrect: false,
          display_type: "issues",
          level: "fatal",
          msg: "the message",
          error: {
            expected: null,
            got: null,
          },
        },
      ];

      lookingGlass.feedback = feedback;
      expect(() => {
        lookingGlass.validatePayloadSignature();
      }).not.toThrow();

      expect(lookingGlass.validatePayloadSignature()).toStrictEqual(
        validatedReports
      );
    });

    it("Should throw an error if the payload is empty", () => {
      const feedback = {};
      lookingGlass.feedback = feedback;
      expect(() => {
        lookingGlass.validatePayloadSignature();
      }).toThrowError(
        "Feedback Payload failed to validate against desired schema.  Make sure all required fields are present and all values are of the proper data type."
      );
    });

    it("Should throw an error if the payload contains unsupported schema keys", () => {
      const feedback = {
        reports: [
          {
            filename: "bread crumbs",
            isCorrect: true,
            bread: "crumbs",
          },
        ],
      };
      lookingGlass.feedback = feedback;
      expect(() => {
        lookingGlass.validatePayloadSignature();
      }).toThrowError(
        "Feedback Payload failed to validate against desired schema.  Make sure all required fields are present and all values are of the proper data type."
      );
    });

    it("Should set the msg value to 'Error' if no msg text is provided", () => {
      const feedback = {
        reports: [
          {
            filename: "some filename",
            isCorrect: false,
            display_type: "issues",
            level: "fatal",
            msg: "",
            error: {
              expected: "expected value",
              got: "got value",
            },
          },
        ],
      };
      lookingGlass.feedback = feedback;
      const reports = lookingGlass.validatePayloadSignature();
      expect(reports[0].msg).toStrictEqual("Error");
    });

    it("Should throw an error if the msg value is 'Error' and no error.expect and error.got text is provided", () => {
      const feedback = {
        reports: [
          {
            filename: "some filename",
            isCorrect: false,
            display_type: "issues",
            level: "fatal",
            msg: "Error",
            error: {
              expected: "",
              got: "",
            },
          },
        ],
      };
      lookingGlass.feedback = feedback;
      expect(() => {
        lookingGlass.validatePayloadSignature();
      }).toThrowError(
        "error.expected and error.got cannot be blank if msg is 'Error'"
      );
    });

    it("Should throw an error if the msg value is valid and error.expect or error.got text is provided", () => {
      const feedback = {
        reports: [
          {
            filename: "some filename",
            isCorrect: false,
            display_type: "issues",
            level: "fatal",
            msg: "Some valid message",
            error: {
              expected: "some expected",
              got: "something got",
            },
          },
        ],
      };
      lookingGlass.feedback = feedback;
      expect(() => {
        lookingGlass.validatePayloadSignature();
      }).toThrowError(
        "error.expected or error.got cannot be populated if msg is something other than 'Error'"
      );
    });

    it("Should set the error.expected value to null if no expected text is provided and a valid msg exists", () => {
      const feedback = {
        reports: [
          {
            filename: "some filename",
            isCorrect: false,
            display_type: "issues",
            level: "fatal",
            msg: "some message",
            error: {
              expected: "",
              got: "",
            },
          },
        ],
      };
      lookingGlass.feedback = feedback;
      const reports = lookingGlass.validatePayloadSignature();
      expect(reports[0].error.expected).toStrictEqual(null);
    });

    it("Should set the error.got value to null if no got text is provided and a valid msg exists", () => {
      const feedback = {
        reports: [
          {
            filename: "some filename",
            isCorrect: false,
            display_type: "issues",
            level: "fatal",
            msg: "Some message",
            error: {
              expected: "",
              got: "",
            },
          },
        ],
      };
      lookingGlass.feedback = feedback;
      const reports = lookingGlass.validatePayloadSignature();
      expect(reports[0].error.got).toStrictEqual(null);
    });
  });

  describe("forceWorkflowToFail method tests", () => {
    beforeEach(() => {
      process.stdout.write = jest.fn();
    });
    it("Should use process.stdout.write exactly 1 time", () => {
      lookingGlass.forceWorkflowToFail();
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
    });
  });

  describe("getReportLevel method tests", () => {
    it("Returns the 'level' of the current report", () => {
      const level = lookingGlass.getReportLevel(baseFeedback.reports[0]);
      expect(level).toStrictEqual("info");
    });
  });
});
