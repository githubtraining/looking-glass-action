const { ValueError, SchemaError } = require("../lib/customErrors");

describe("Custom Errors", () => {
  describe("ValueError tests", () => {
    let valueError;
    const expected = {
      name: "ValueError",
      message: "bad value",
      userMessage:
        "Oops, looks like something isn't working right.  This is most likely not your fault!  Please open an issue in this lab's template repository!",
    };

    beforeEach(() => {
      valueError = new ValueError("bad value");
    });

    it("ValueError should have a userMessage property", () => {
      expect(valueError.userMessage).toStrictEqual(expected.userMessage);
    });

    it("ValueError should have a name property of 'ValueError'", () => {
      expect(valueError.name).toStrictEqual(expected.name);
    });
    it("ValueError should have a message property equal to 'bad value'", () => {
      expect(valueError.message).toStrictEqual(expected.message);
    });
  });

  describe("SchemaError tests", () => {
    let schemaError;
    const expected = {
      name: "SchemaError",
      message:
        "Feedback Payload failed to validate against desired schema.  Make sure all required fields are present and all values are of the proper data type.",
      userMessage:
        "Oops, looks like something isn't working right.  This is most likely not your fault!  Please open an issue in this lab's template repository!",
    };

    beforeEach(() => {
      schemaError = new SchemaError();
    });

    it("SchemaError should have a userMessage property", () => {
      expect(schemaError.userMessage).toStrictEqual(expected.userMessage);
    });

    it("SchemaError should have a name property of 'SchemaError'", () => {
      expect(schemaError.name).toStrictEqual(expected.name);
    });
    it("SchemaErr0r should use a hard coded message property", () => {
      expect(schemaError.message).toStrictEqual(expected.message);
    });
  });
});
