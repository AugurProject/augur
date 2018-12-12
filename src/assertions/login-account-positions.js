export default function(loginAccountPositions) {
  describe(`loginAccountPositions' shape`, () => {
    expect(loginAccountPositions).toBeDefined();
    expect(typeof loginAccountPositions).toBe("object");

    test("markets", () => {
      expect(loginAccountPositions.markets).toBeDefined();
      expect(Array.isArray(loginAccountPositions.markets)).toBe(true);
    });

    test("summary", () => {
      expect(loginAccountPositions.summary).toBeDefined();
      expect(typeof loginAccountPositions.summary).toBe("object");
    });
  });
}
