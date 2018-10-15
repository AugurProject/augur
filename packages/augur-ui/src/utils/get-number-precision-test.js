import getPrecision from "utils/get-number-precision";

describe("utils/format-number.js", () => {
  const values = [
    {
      value: null,
      defaultValue: 4,
      result: 4
    },
    {
      value: null,
      defaultValue: 3,
      result: 3
    },
    {
      value: 0.0001,
      defaultValue: 1,
      result: 4
    },
    {
      value: 0.001,
      defaultValue: 1,
      result: 3
    },
    {
      value: 0.01,
      defaultValue: 1,
      result: 2
    },
    {
      value: 0.1,

      defaultValue: 3,
      result: 1
    },
    {
      value: 1.0,
      defaultValue: 3,
      result: 1
    },
    {
      value: 1,
      defaultValue: 3,
      result: 0
    },
    {
      value: 10,
      defaultValue: 3,
      result: 0
    }
  ];

  values.forEach(test => {
    describe(`test precision: ${test.value}`, () => {
      test("number should have specific precision", () => {
        expect(getPrecision(test.value, test.defaultValue)).toEqual(
          test.result
        );
      });
    });
  });
});
