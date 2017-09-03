import speedomatic from 'speedomatic';
import { ZERO } from 'modules/trade/constants/numbers';

/**
 *
 * @param {Object} marketOutcomesData key: outcomeID, value: outcome
 * @return {Number}
 */
export default function (marketOutcomesData) {
  return Object.keys(marketOutcomesData)
    .map(outcomeId => marketOutcomesData[outcomeId])
    .reduce((outstandingShares, outcome) => outstandingShares.plus(speedomatic.bignum(outcome.outstandingShares)), ZERO)
    .toNumber();
}
