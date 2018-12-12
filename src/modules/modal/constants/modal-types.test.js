import * as modalTypes from "modules/modal/constants/modal-types";

describe("modules/modal/constants/modal-types", () => {
  test(`should return the expected value 'MODAL_LEDGER'`, () => {
    const expected = "MODAL_LEDGER";
    expect(modalTypes.MODAL_LEDGER).toEqual(expected);
  });
  test(`should return the expected value 'MODAL_NETWORK_MISMATCH'`, () => {
    const expected = "MODAL_NETWORK_MISMATCH";
    expect(modalTypes.MODAL_NETWORK_MISMATCH).toEqual(expected);
  });
  test(`should return the expected value 'MODAL_NETWORK_DISCONNECTED'`, () => {
    const expected = "MODAL_NETWORK_DISCONNECTED";
    expect(modalTypes.MODAL_NETWORK_DISCONNECTED).toEqual(expected);
  });
});
