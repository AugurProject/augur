import { ETH, REP } from "modules/account/constants/asset-types";

describe("modules/account/constants/asset-types.js", () => {
  test("ETH should return the expected string", () => {
    expect(ETH).toStrictEqual("ETH");
  });

  test("REP should return the expected string", () => {
    expect(REP).toStrictEqual("REP");
  });
});
