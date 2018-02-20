
import { SCALAR } from 'modules/markets/constants/market-types'

export const getPayoutNumerators = (market, selectedOutcome, invalid) => {

  const { maxPrice, minPrice, numTicks } = market
  const payoutNumerators = Array(market.numOutcomes).fill(0)
  const isScalar = market.marketType === SCALAR

  if (invalid) {
    const equalValue = numTicks / market.numOutcomes
    return Array(market.numOutcomes).fill(equalValue)

  } else if (isScalar) {
    const priceRange = maxPrice - minPrice
    const reportNormalizedToZero = selectedOutcome - minPrice
    const longPayout = (reportNormalizedToZero * numTicks) / priceRange
    const shortPayout = numTicks - longPayout
    payoutNumerators[0] = shortPayout
    payoutNumerators[1] = longPayout
  } else {
    // for binary and categorical the selected outcome is outcome.id
    payoutNumerators[selectedOutcome] = market.numTicks
  }

  return payoutNumerators
}
