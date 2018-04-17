import { SCALAR } from 'modules/markets/constants/market-types'
import { createBigNumber } from 'utils/create-big-number'

export default function calculatePayoutNumeratorsValue(market, payout, isInvalid) {
  const {
    maxPrice,
    minPrice,
    numTicks,
    marketType,
  } = market
  const isScalar = marketType === SCALAR

  if (!payout) return null
  if (payout.length === 0) return null
  if (isInvalid) return null

  if (isScalar) {
    const longPayout = createBigNumber(payout[1], 10)
    const priceRange = createBigNumber(maxPrice, 10).minus(createBigNumber(minPrice, 10))
    // calculation: ((longPayout * priceRange) / numTicks) + minPrice
    return ((longPayout.times(priceRange)).dividedBy(createBigNumber(numTicks, 10))).plus(createBigNumber(minPrice, 10)).toString()
  }

  return payout.findIndex(item => item > 0).toString()
}
