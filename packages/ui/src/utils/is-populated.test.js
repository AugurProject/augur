import isPopulated from "src/utils/is-populated";

describe("is-populated", () => {
  describe("should return false", () => {
    it("for empty object", () => {
      const value = {};
      const returnValue = isPopulated(value);
      expect(returnValue).toEqual(false);
    });

    it("for null", () => {
      const value = null;
      const returnValue = isPopulated(value);
      expect(returnValue).toEqual(false);
    });

    it("for undefined", () => {
      const value = undefined;
      const returnValue = isPopulated(value);
      expect(returnValue).toEqual(false);
    });

    it("for empty array", () => {
      const value = [];
      const returnValue = isPopulated(value);
      expect(returnValue).toEqual(false);
    });

    it("for false", () => {
      const value = false;
      const returnValue = isPopulated(value);
      expect(returnValue).toEqual(false);
    });

    it("for empty string", () => {
      const value = "";
      const returnValue = isPopulated(value);
      expect(returnValue).toEqual(false);
    });
  });

  describe("should return true", () => {
    it("for filled object", () => {
      const value = { hi: "hi" };
      const returnValue = isPopulated(value);
      expect(returnValue).toEqual(true);
    });

    it("for filled array", () => {
      const value = [1, 3];
      const returnValue = isPopulated(value);
      expect(returnValue).toEqual(true);
    });

    it("for true", () => {
      const value = true;
      const returnValue = isPopulated(value);
      expect(returnValue).toEqual(true);
    });

    it("for non-empty string", () => {
      const value = "hi";
      const returnValue = isPopulated(value);
      expect(returnValue).toEqual(true);
    });
  });
});
