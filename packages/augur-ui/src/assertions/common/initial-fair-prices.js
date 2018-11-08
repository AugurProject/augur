export default function(initialFairPrices, refObj) {
  describe(`${refObj}'s initiaiFairPrices`, () => {
    describe("type", () => {
      test("should exist", () => {
        expect(initialFairPrices.type).toBeDefined();
      });

      test("should be a string", () => {
        expect(typeof initialFairPrices.type).toBe("string");
      });
    });

    describe("values", () => {
      test("should exist", () => {
        expect(initialFairPrices.values).toBeDefined();
      });

      test("should be an array", () => {
        expect(Array.isArray(initialFairPrices.values)).toBe(true);
      });
    });

    describe("raw", () => {
      test("should exist", () => {
        expect(initialFairPrices.raw).toBeDefined();
      });

      test("should be an array", () => {
        expect(Array.isArray(initialFairPrices.raw)).toBe(true);
      });
    });
  });
}
