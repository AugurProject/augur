import assertFormattedNumber from "src/assertions/common/formatted-number";

export default function(positionsMarkets) {
  expect(positionsMarkets).toBeDefined();
  expect(Array.isArray(positionsMarkets)).toBe(true);

  positionsMarkets.forEach(positionMarket =>
    assertPositionMarket(positionMarket)
  );
}

function assertPositionMarket(positionMarket) {
  describe("positionMarket", () => {
    test("id", () => {
      expect(positionMarket.id).toBeDefined();
      expect(typeof positionMarket.id).toBe("string");
    });

    test("description", () => {
      expect(positionMarket.description).toBeDefined();
      expect(typeof positionMarket.description).toBe("string");
    });

    positionMarket.myPositionOutcomes.forEach(positionOutcome =>
      assertOutcome(positionOutcome)
    );

    assertPositionMarketSummary(positionMarket.myPositionsSummary);
  });
}

function assertOutcome(outcome) {
  expect(typeof outcome.id).toBe("number");
  expect(typeof outcome.name).toBe("string");
  assertFormattedNumber(
    outcome.lastPrice,
    "positionsMarkets.positionOutcomes[outcome].lastPrice"
  );
  assertPosition(outcome.position);
}

function assertPosition(position) {
  assertFormattedNumber(position.numPositions, "position.numPositions");
  assertFormattedNumber(position.qtyShares, "position.qtyShares");
  assertFormattedNumber(position.purchasePrice, "position.purchasePrice");
  assertFormattedNumber(position.unrealizedNet, "position.unrealizedNet");
  assertFormattedNumber(position.realizedNet, "position.realizedNet");
  assertFormattedNumber(position.totalNet, "position.totalNet");
}

function assertPositionMarketSummary(summary) {
  assertFormattedNumber(
    summary.unrealizedNet,
    "myPositionsSummary.unrealizedNet"
  );
  assertFormattedNumber(summary.realizedNet, "myPositionsSummary.realizedNet");
  assertFormattedNumber(summary.totalNet, "myPositionsSummary.totalNet");
}
