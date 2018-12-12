export default function(portfolioSummaries) {
  describe(`portfolio's summaries shape`, () => {
    expect(portfolioSummaries).toBeDefined();
    expect(Array.isArray(portfolioSummaries)).toBe(true);

    portfolioSummaries.forEach(summary => {
      assertSummary(summary);
    });
  });
}

function assertSummary(summary) {
  describe(`summary's shape`, () => {
    test("label", () => {
      expect(summary.label).toBeDefined();
      expect(typeof summary.label).toBe("string");
    });

    test("value", () => {
      expect(summary.value).toBeDefined();
      expect(typeof summary.value).toBe("string");
    });
  });
}
