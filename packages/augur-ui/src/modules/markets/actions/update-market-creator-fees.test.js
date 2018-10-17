import {
  UPDATE_MARKET_CREATOR_FEES,
  updateMarketCreatorFees
} from "modules/markets/actions/market-creator-fees-management";

describe("modules/markets/actions/market-creator-fees-management.js", () => {
  const data = { 0x0000000000000000000000000000000000000001: "a big number" };

  const actual = updateMarketCreatorFees(data);

  const expected = {
    type: UPDATE_MARKET_CREATOR_FEES,
    data: { marketCreatorFees: data }
  };

  it("should return the expected object", () => {
    assert.deepEqual(
      actual,
      expected,
      `updateMarketCreatorFees didn't return the expected object`
    );
  });
});
