export default function(reportableOutcomes) {
  describe(`reportableOutcomes' shape`, () => {
    expect(reportableOutcomes).toBeDefined();
    expect(Array.isArray(reportableOutcomes)).toBe(true);

    reportableOutcomes.forEach(outcome => {
      test("id", () => {
        expect(outcome.id).toBeDefined();
        expect(typeof outcome.id).toBe("string");
      });

      test("name", () => {
        expect(outcome.name).toBeDefined();
        expect(typeof outcome.name).toBe("string");
      });
    });
  });
}
