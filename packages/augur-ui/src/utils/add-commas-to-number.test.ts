import addCommas from "utils/add-commas-to-number";

describe("utils/add-commas-to-number.js", () => {
  let mockNumber;
  let out;

  beforeEach(() => {
    mockNumber = null;
    out = null;
  });

  test("should return the number as a string", () => {
    mockNumber = 1;

    expect(typeof addCommas(mockNumber)).toBe("string");
  });

  test("should not insert commas with integers less than 999", () => {
    mockNumber = 999;
    out = "999";

    expect(addCommas(mockNumber)).toEqual(out);
  });

  test("should insert commas with integers greater than 1,000", () => {
    mockNumber = 100000000;
    out = "100,000,000";

    expect(addCommas(mockNumber)).toEqual(out);
  });

  test("should handle numbers with decimal places", () => {
    mockNumber = 100000000.123456;
    out = "100,000,000.123456";

    expect(addCommas(mockNumber)).toEqual(out);
  });
});
