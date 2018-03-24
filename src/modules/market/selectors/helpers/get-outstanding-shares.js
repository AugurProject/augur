import BigNumber from 'bignumber.js'
import { ZERO } from 'modules/trade/constants/numbers'

/**
 *
 * @param {Object} marketOutcomesData key: outcomeId, value: outcome
 * @return {Number}
 */
export default function (marketOutcomesData) {
  return Object.keys(marketOutcomesData)
    .map(outcomeId => marketOutcomesData[outcomeId])
    .reduce((outstandingShares, outcome) => outstandingShares.plus(new BigNumber(outcome.outstandingShares || 0, 10)), ZERO)
    .toNumber()
}
