import { checkPropsChange } from "src/utils/check-props-change";

describe("checkPropsChange", () => {
  const obj1 = {
    attr1: "47",
    attr2: 2,
    attr3: true
  };

  const obj2 = Object.assign({}, obj1, {
    attr1: "46"
  });

  describe("when nothing has changed", () => {
    test("should return false", () => {
      expect(checkPropsChange(obj1, obj1, ["attr1"])).toBeFalsy();
    });
  });

  describe("when the passed attr has changed", () => {
    test("should return true", () => {
      expect(checkPropsChange(obj1, obj2, ["attr1"])).toBeTruthy();
    });
  });

  describe("when only an uninteresting attr has changed", () => {
    test("should return false", () => {
      expect(checkPropsChange(obj1, obj2, ["attr2"])).toBeFalsy();
    });
  });

  describe("when no attr are passed", () => {
    test("should return false", () => {
      expect(checkPropsChange(obj1, obj2, [])).toBeFalsy();
    });
  });
});
