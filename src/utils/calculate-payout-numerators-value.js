import { SCALAR } from 'modules/markets/constants/market-types'

export const calculatePayoutNumeratorsValue = (market, payoutNumerators, isInvalid) => {
  if (!payoutNumerators) return null
  if (payoutNumerators.length === 0) return null
  if (isInvalid) return null

  const {
    maxPrice, minPrice, numTicks, marketType,
  } = market
  const isScalar = marketType === SCALAR

  if (isScalar) {
    const longPayout = payoutNumerators[1]
    const priceRange = maxPrice - minPrice
    return ((longPayout / numTicks) * priceRange) + minPrice
  }

  return payoutNumerators.findIndex(item => item > 0)
}
