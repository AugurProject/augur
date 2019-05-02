import * as constants from "modules/common-elements/constants";

describe("modules/common-elements/constants.ts", () => {
  test("ETH should return the expected string", () => {
    expect(constants.ETH).toStrictEqual("ETH");
  });

  test("DAI should return the expected string", () => {
    expect(constants.DAI).toStrictEqual("DAI");
  });

  test("REP should return the expected string", () => {
    expect(constants.REP).toStrictEqual("REP");
  });

  test(`should return the expected value 'MODAL_LEDGER'`, () => {
    expect(constants.MODAL_LEDGER).toStrictEqual("MODAL_LEDGER");
  });

  test(`should return the expected value 'MODAL_NETWORK_MISMATCH'`, () => {
    expect(constants.MODAL_NETWORK_MISMATCH).toStrictEqual(
      "MODAL_NETWORK_MISMATCH"
    );
  });

  test(`should return the expected value 'MODAL_NETWORK_DISCONNECTED'`, () => {
    expect(constants.MODAL_NETWORK_DISCONNECTED).toStrictEqual(
      "MODAL_NETWORK_DISCONNECTED"
    );
  });
});
