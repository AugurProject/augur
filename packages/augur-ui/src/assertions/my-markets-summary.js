export default function(myMarketsSummary) {
  describe(`myMarketsSummary's shape`, () => {
    expect(myMarketsSummary).toBeDefined();
    expect(typeof myMarketsSummary).toBe("object");

    assertMyMarketsSummary(myMarketsSummary);
  });
}

export function assertMyMarketsSummary(summary) {
  describe(`summary's shape`, () => {
    expect(summary).toBeDefined();
    expect(typeof summary).toBe("object");

    test("numMarkets", () => {
      expect(summary.numMarkets).toBeDefined();
      expect(typeof summary.numMarkets).toBe("number");
    });
  });
}
