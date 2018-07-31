
import { SCALAR } from 'modules/markets/constants/market-types'
import { createBigNumber, BigNumber } from 'utils/create-big-number'

export const getPayoutNumerators = (market, selectedOutcome, invalid) => {

  const { maxPrice, minPrice } = market
  const numTicks = createBigNumber(market.numTicks)
  const payoutNumerators = Array(market.numOutcomes).fill(createBigNumber(0))
  const isScalar = market.marketType === SCALAR

  if (invalid) {
    const equalValue = createBigNumber(numTicks).dividedBy(market.numOutcomes).dp(0, BigNumber.ROUND_DOWN)
    return Array(market.numOutcomes).fill(equalValue)

  } else if (isScalar) {
    // selectedOutcome must be a BN as string
    const priceRange = createBigNumber(maxPrice).minus(createBigNumber(minPrice))
    const reportNormalizedToZero = createBigNumber(selectedOutcome).minus(createBigNumber(minPrice))
    const longPayout = reportNormalizedToZero.times(numTicks).dividedBy(priceRange)
    const shortPayout = numTicks.minus(longPayout)
    payoutNumerators[0] = shortPayout
    payoutNumerators[1] = longPayout
  } else {
    // for binary and categorical the selected outcome is outcome.id
    // and must be a number
    payoutNumerators[selectedOutcome] = numTicks
  }

  return payoutNumerators
}
