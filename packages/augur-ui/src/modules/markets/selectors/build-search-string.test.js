import { buildSearchString } from "../../../src/modules/markets/selectors/build-search-string";

describe("modules/markets/selectors/build-search-string.js", () => {
  test("should return nothing", () => {
    const actual = buildSearchString(undefined, []);
    const expected = undefined;
    assert.deepEqual(
      actual,
      expected,
      `Didn't return the expected default value`
    );
  });

  test("should return the existing value", () => {
    const actual = buildSearchString(undefined, ["tag1", "tag2"]);
    const expected = "tag1 OR tag2";
    assert.deepEqual(
      actual,
      expected,
      `Didn't return the expected existing value`
    );
  });

  test("should return the existing value", () => {
    const actual = buildSearchString(undefined, ["tag1"]);
    const expected = "tag1";
    assert.deepEqual(
      actual,
      expected,
      `Didn't return the expected existing value`
    );
  });

  test("keyword is too short to search on", () => {
    const actual = buildSearchString("s", []);
    const expected = undefined;
    assert.deepEqual(
      actual,
      expected,
      `Didn't return the expected updated value`
    );
  });

  test("add keyword in search", () => {
    const actual = buildSearchString("suez", []);
    const expected = "suez*";
    assert.deepEqual(
      actual,
      expected,
      `Didn't return the expected updated value`
    );
  });

  test("add partial keyword and tag", () => {
    const actual = buildSearchString("bobo", ["tag1"]);
    const expected = "tag1 OR bobo*";
    assert.deepEqual(
      actual,
      expected,
      `Didn't return the expected updated value`
    );
  });

  test("add keyword and tag", () => {
    const actual = buildSearchString("bobo ", ["tag1"]);
    const expected = "tag1 OR bobo";
    assert.deepEqual(
      actual,
      expected,
      `Didn't return the expected updated value`
    );
  });

  test("add keyword phrase", () => {
    const actual = buildSearchString('"bobo walked to town"', []);
    const expected = '"bobo walked to town"';
    assert.deepEqual(
      actual,
      expected,
      `Didn't return the expected updated value`
    );
  });
});
