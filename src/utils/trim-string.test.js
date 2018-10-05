import trimString from "utils/trim-string";

describe("utils/trim-string", () => {
  test(`should return null when argument is undefined`, () => {
    const actual = trimString();

    const expected = null;

    expect(actual).toBe(expected);
  });

  test(`should return a trimmed string`, () => {
    const actual = trimString("string to be trimmed");

    const expected = "stri...";

    expect(actual).toBe(expected);
  });
});
