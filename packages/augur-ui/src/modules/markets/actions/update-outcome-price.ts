export const UPDATE_OUTCOME_PRICE = "UPDATE_OUTCOME_PRICE";

export function updateOutcomePrice(
  marketId: string,
  outcomeId: string | Number,
  price: string
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
