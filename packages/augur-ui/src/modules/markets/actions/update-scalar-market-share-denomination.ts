export const UPDATE_SCALAR_MARKET_SHARE_DENOMINATION =
  "UPDATE_SCALAR_MAKRET_SHARE_DENOMINATION";

export function updateScalarMarketShareDenomination(
  marketId: String,
  denomination: String
) {
  return {
    type: UPDATE_SCALAR_MARKET_SHARE_DENOMINATION,
    data: {
      marketId,
      denomination
    }
  };
}
