export const UPDATE_OUTCOME_PRICE = "UPDATE_OUTCOME_PRICE";

export function updateOutcomePrice(
  marketId: String,
  outcomeId: String | Number,
  price: String
) {
  return {
    type: UPDATE_OUTCOME_PRICE,
    data: {
      marketId,
      outcomeId,
      price
    }
  };
}
