import reducer from "modules/modal/reducers/modal";

import { UPDATE_MODAL } from "modules/modal/actions/update-modal";
import { CLOSE_MODAL } from "modules/modal/actions/close-modal";

describe("modules/modal/reducers/modal", () => {
  test("should return the DEFAULT_STATE", () => {
    const actual = reducer(undefined, { type: null });

    const expected = {};

    expect(actual).toEqual(expected);
  });

  test("should return the passed value", () => {
    const actual = reducer({ test: "TEST" }, { type: null });

    const expected = {
      test: "TEST"
    };

    expect(actual).toEqual(expected);
  });

  test("should return the updated state when case is UPDATE_MODAL", () => {
    const actual = reducer(
      { test: "TEST" },
      { type: UPDATE_MODAL, data: { modalOptions: { test: "NEW" } } }
    );

    const expected = {
      test: "NEW"
    };

    expect(actual).toEqual(expected);
  });

  test("should return the updated DEFAULT_STATE when case is CLOSE_MODAL", () => {
    const actual = reducer({ test: "TEST" }, { type: CLOSE_MODAL });

    const expected = {};

    expect(actual).toEqual(expected);
  });
});
