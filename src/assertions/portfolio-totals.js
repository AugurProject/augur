import assertFormattedNumber from "src/assertions/common/formatted-number";

export default function(portfolioTotals) {
  describe(`portfolioTotals' shape`, () => {
    expect(portfolioTotals).toBeDefined();
    expect(typeof portfolioTotals).toBe("object");

    test("net", () => {
      expect(portfolioTotals.netChange).toBeDefined();
      assertFormattedNumber(
        portfolioTotals.netChange,
        "portfolio.totals.netChange"
      );
    });
  });
}
