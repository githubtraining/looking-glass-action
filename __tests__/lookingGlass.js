const { LookingGlass } = require("../lib/lookingGlass");

describe("Looking Glass Methods", () => {
  let octokit;
  let context;
  beforeAll(() => {
    octokit = {
      title: null,
    };
    context = {
      title: null,
    };
  });
  describe("validatePayloadSignature method tests", () => {
    it("Should pass if the payload matches the signature schema", () => {
      const feedback = {
        reports: [
          {
            filename: "the filename associated with the report",
            isCorrect: true,
            level: "info",
            display_type: "actions",
            msg: "the message",
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
      const lookingGlass = new LookingGlass(octokit, context, feedback);
      const res = lookingGlass.validatePayloadSignature();
      expect(res.error).toBe(undefined);
    });

    it("Should fail if the payload is empty", () => {
      const feedback = {};
      const lookingGlass = new LookingGlass(octokit, context, feedback);
      const res = lookingGlass.validatePayloadSignature();
      expect(res.error.details).toStrictEqual([
        {
          message: '"reports" is required',
          path: ["reports"],
          type: "any.required",
          context: { label: "reports", key: "reports" },
        },
      ]);
    });

    it("Should fail if the payload contains unsupported keys", () => {
      const feedback = {
        reports: [
          {
            filename: "bread crumbs",
            isCorrect: true,
            bread: "crumbs",
          },
        ],
      };
      const lookingGlass = new LookingGlass(octokit, context, feedback);
      const res = lookingGlass.validatePayloadSignature();
      expect(res.error.details).toStrictEqual([
        {
          message: '"reports[0].bread" is not allowed',
          path: ["reports", 0, "bread"],
          type: "object.unknown",
          context: {
            child: "bread",
            label: "reports[0].bread",
            value: "crumbs",
            key: "bread",
          },
        },
      ]);
    });
  });
});
