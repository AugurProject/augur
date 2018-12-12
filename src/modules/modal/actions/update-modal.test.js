import { UPDATE_MODAL, updateModal } from "modules/modal/actions/update-modal";

describe("modules/modal/actions/update-modal", () => {
  test("should return the expected value", () => {
    const actual = updateModal({ test: "TEST" });

    const expected = {
      type: UPDATE_MODAL,
      data: {
        modalOptions: { test: "TEST" }
      }
    };

    expect(actual).toEqual(expected);
  });
});
