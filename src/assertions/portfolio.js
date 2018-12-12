export default function(portfolio) {
  describe("portfolio state", () => {
    expect(portfolio).toBeDefined();
    expect(typeof portfolio).toBe("object");
  });
}
