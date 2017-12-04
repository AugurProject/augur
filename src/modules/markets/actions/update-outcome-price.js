export const UPDATE_OUTCOME_PRICE = 'UPDATE_OUTCOME_PRICE'

export function updateOutcomePrice(marketID, outcomeID, price) {
  return {
    type: UPDATE_OUTCOME_PRICE, marketID, outcomeID, price
  }
}
