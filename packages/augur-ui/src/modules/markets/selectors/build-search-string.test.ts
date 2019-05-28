import { buildSearchString } from "modules/markets/selectors/build-search-string";

describe("modules/markets/selectors/build-search-string.js", () => {
  test("should return nothing", () => {
    const actual = buildSearchString(undefined, []);
    const expected = undefined;
    expect(actual).toEqual(expected);
  });

  test("should return the existing value", () => {
    const actual = buildSearchString(undefined, ["tag1", "tag2"]);
    const expected = "tags: tag1 OR tags: tag2";
    expect(actual).toEqual(expected);
  });

  test("should return the existing value please", () => {
    const actual = buildSearchString(undefined, ["tag1"]);
    const expected = "tags: tag1";
    expect(actual).toEqual(expected);
  });

  test("keyword is too short to search on", () => {
    const actual = buildSearchString("s", []);
    const expected = undefined;
    expect(actual).toEqual(expected);
  });

  test("add keyword in search", () => {
    const actual = buildSearchString("suez", []);
    const expected = "suez*";
    expect(actual).toEqual(expected);
  });

  test("add partial keyword and tag", () => {
    const actual = buildSearchString("bobo", ["tag1"]);
    const expected = "tags: tag1 OR bobo*";
    expect(actual).toEqual(expected);
  });

  test("add keyword and tag", () => {
    const actual = buildSearchString("bobo ", ["tag1"]);
    const expected = "tags: tag1 OR bobo";
    expect(actual).toEqual(expected);
  });

  test("add keyword phrase", () => {
    const actual = buildSearchString('"bobo walked to town"', []);
    const expected = '"bobo walked to town"';
    expect(actual).toEqual(expected);
  });
});
