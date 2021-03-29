const schema = require("./lib/payloadSignature");

const obj = {
  reports: [
    {
      filename: "somefilename",
      isCorrect: true,
      level: "info",
      display_type: "issues",
      msg: null,
      error: {
        expected: "somthing crazy",
        got: "something not so crazy",
      },
    },
  ],
};

const { error, value } = schema.validate(obj);

console.log(`error: ${error}`);
console.log(`value: ${value.reports[0].filename}`);
