import { SCALAR } from 'modules/markets/constants/market-types'
import { WrappedBigNumber } from 'utils/wrapped-big-number'

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
    const longPayout = WrappedBigNumber(payout[1], 10)
    const priceRange = WrappedBigNumber(maxPrice, 10).minus(WrappedBigNumber(minPrice, 10))
    // calculation: ((longPayout * priceRange) / numTicks) + minPrice
    return ((longPayout.times(priceRange)).dividedBy(WrappedBigNumber(numTicks, 10))).plus(WrappedBigNumber(minPrice, 10)).toString()
  }

  return payout.findIndex(item => item > 0).toString()
}
