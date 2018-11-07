import isUserLoggedIn from "modules/auth/helpers/is-user-logged-in";

describe("modules/auth/helpers/is-user-logged-in.js", () => {
  test("should return false for anonymous user", () => {
    expect(isUserLoggedIn({})).toBeFalsy();
    expect(isUserLoggedIn({ address: null })).toBeFalsy();
  });

  test("should return true for logged-in user", () => {
    expect(isUserLoggedIn({ address: "duffmanohyea" })).toBeTruthy();
  });
});
