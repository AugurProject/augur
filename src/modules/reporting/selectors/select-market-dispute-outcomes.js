import BigNumber from 'bignumber.js'
import { createSelector } from 'reselect'
import { selectMarkets } from 'modules/markets/selectors/markets-all'
import { constants } from 'services/augurjs'
import store from 'src/store'
import { isEmpty } from 'lodash'
import { formatRepTokens } from 'utils/format-number'
import { BINARY, SCALAR, CATEGORICAL } from 'modules/markets/constants/market-types'

export default function () {
  return selectMarketDisputeOutcomes(store.getState())
}

/*
  Binary: Tenative, others (Yes, No, Invalid)
  Categorical: Tentative, others (others + Invalid)
  Scalar: Tentative -> outcomes I currently have stake in -> outcomes that have current stake -> outcomes that have stake + ( Invalid promissed last spot)
*/

export const selectMarketDisputeOutcomes = createSelector(
  selectMarkets,
  (markets) => {
    if (isEmpty(markets)) {
      return {}
    }
    const { ETHER } = augur.rpc.constants
    const disputeMarkets = markets.filter(market => market.reportingState === constants.REPORTING_STATE.CROWDSOURCING_DISPUTE || market.reportingState === constants.REPORTING_STATE.AWAITING_NEW_WINDOW)
    const disputeOutcomes = {}
    disputeMarkets.forEach((marketData) => {
      disputeOutcomes[marketData.id] = []
      if (!marketData.stakes) return;
      disputeOutcomes[marketData.id] = marketData.stakes.reduce((p, stakeData, index) => {
        const name = getOutcomeName(marketData, stakeData);
        if (name === "") return p;
        p.push({
          id: index,
          name: getOutcomeName(marketData, stakeData),
          totalRep: formatRepTokens(new BigNumber(stakeData.totalStake).dividedBy(ETHER)).formattedValue,
          userRep: formatRepTokens(new BigNumber(stakeData.accountStakeIncomplete).dividedBy(ETHER)).formattedValue,
          goal: formatRepTokens(new BigNumber(stakeData.size).dividedBy(ETHER)).formattedValue,
        })
        return p
      }, [])
    });
    console.log(disputeOutcomes);
    return disputeOutcomes;
  }
)

function getOutcomeName(marketData, stakeData) {
  // TODO when string bug fixed:
  // if (stakeData.isInvalid) return "Invalid"

  if (marketData.marketType === BINARY) {
    if (stakeData.payout[0] === marketData.numTicks) return "No"
    if (stakeData.payout[1] === marketData.numTicks) return "Yes"
  }

  if (marketData.marketType === CATEGORICAL) {
    for (var i = 0; i < stakeData.payout.length; i++) {
      if (stakeData.payout[i] === marketData.numTicks) return marketData.outcomes[i].description
    }
  }

  if (marketData.marketType === SCALAR) {
    return new BigNumber(stakeData.payout[1]).mul(new BigNumber(marketData.tickSize)).add(marketData.minPrice).toString()
  }

  return ""
}