import assertFormattedNumber from "assertions/common/formatted-number";
import assertFormattedDate from "assertions/common/formatted-date";

export default function(myMarkets) {
  describe(`myMarkets' shape`, () => {
    expect(myMarkets).toBeDefined();
    expect(Array.isArray(myMarkets)).toBe(true);

    myMarkets.forEach(market => {
      assertMyMarkets(market);
    });
  });
}

export function assertMyMarkets(market) {
  describe(`myMarket's shape`, () => {
    test("id", () => {
      expect(market.id).toBeDefined();
      expect(typeof market.id).toBe("string");
    });

    test("description", () => {
      expect(market.description).toBeDefined();
      expect(typeof market.description).toBe("string");
    });

    test("endTime", () => {
      expect(market.endTime).toBeDefined();

      assertFormattedDate(market.endTime, "loginAccountMarkets.endTime");
    });

    test("fees", () => {
      expect(market.fees).toBeDefined();

      assertFormattedNumber(market.fees, "loginAccountMarkets.fees");
    });

    test("volume", () => {
      expect(market.volume).toBeDefined();

      assertFormattedNumber(market.volume, "loginAccountMarkets.volume");
    });

    test("numberOfTrades", () => {
      expect(market.numberOfTrades).toBeDefined();

      assertFormattedNumber(
        market.numberOfTrades,
        "loginAccountMarkets.numberOfTrades"
      );
    });

    test("averageTradeSize", () => {
      expect(market.averageTradeSize).toBeDefined();

      assertFormattedNumber(
        market.averageTradeSize,
        "loginAccountMarkets.averageTradeSize"
      );
    });

    test("openVolume", () => {
      expect(market.openVolume).toBeDefined();

      assertFormattedNumber(
        market.openVolume,
        "loginAccountMarkets.openVolume"
      );
    });
  });
}
