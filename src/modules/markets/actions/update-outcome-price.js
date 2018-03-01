export const UPDATE_OUTCOME_PRICE = 'UPDATE_OUTCOME_PRICE'

export function updateOutcomePrice(marketId, outcomeId, price) {
  return {
    type: UPDATE_OUTCOME_PRICE, marketId, outcomeId, price,
  }
}
