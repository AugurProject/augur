import { createBigNumber } from 'utils/create-big-number'
import { ZERO } from 'modules/trade/constants/numbers'

/**
 *
 * @param {Object} marketOutcomesData key: outcomeId, value: outcome
 * @return {Number}
 */
export default function (marketOutcomesData) {
  return Object.keys(marketOutcomesData)
    .map(outcomeId => marketOutcomesData[outcomeId])
    .reduce((outstandingShares, outcome) => outstandingShares.plus(createBigNumber(outcome.outstandingShares || 0, 10)), ZERO)
    .toNumber()
}
