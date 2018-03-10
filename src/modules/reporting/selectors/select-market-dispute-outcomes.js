import BigNumber from 'bignumber.js'
import { createSelector } from 'reselect'
import { selectMarkets } from 'modules/markets/selectors/markets-all'
import { constants, augur } from 'services/augurjs'
import store from 'src/store'
import { isEmpty } from 'lodash'
import { formatRepTokens } from 'utils/format-number'
import { BINARY, SCALAR, CATEGORICAL } from 'modules/markets/constants/market-types'

export default function () {
  return selectMarketDisputeOutcomes(store.getState())
}

// We expect to receive all staked current outcomes ordered by user stake then by total stake limited to 9 results

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
      if (!marketData.numTicks) return
      if (!marketData.stakes) return

      // Tracking structures
      const tentativeWinningOutcome = []
      const normalPayouts = getNormalPayouts(marketData)

      // Add all human-valid outcome payout to the list. We ignore "strange" payouts by checking if they have a human readable name. If a "strange" payout is the tentative winner however we let it through since we have to display that.
      disputeOutcomes[marketData.id] = marketData.stakes.reduce((p, stakeData, index) => {
        const name = getOutcomeName(marketData, stakeData)
        if (name === '' && !stakeData.isTentativeWiningOutcome) return p

        const outcomeData = {
          id: index,
          name: name || ('Partial payout: ' + stakeData.payout),
          totalRep: formatRepTokens(new BigNumber(stakeData.totalStake).dividedBy(ETHER)).formattedValue,
          userRep: formatRepTokens(new BigNumber(stakeData.accountStakeIncomplete).dividedBy(ETHER)).formattedValue,
          goal: formatRepTokens(new BigNumber(stakeData.size).dividedBy(ETHER)).formattedValue,
        }

        if (stakeData.isTentativeWiningOutcome) {
          tentativeWinningOutcome.push(outcomeData)
        } else {
          p.push(outcomeData)
        }

        if (normalPayouts[stakeData.payout] !== undefined) normalPayouts[stakeData.payout] = true
        if (stakeData.isInvalid) normalPayouts.invalid = true

        return p
      }, [])

      // Append any unstaked "normal" payouts
      Object.keys(normalPayouts).forEach((payout, index) => {
        if (normalPayouts[payout]) return
        if (payout === 'invalid') return
        disputeOutcomes[marketData.id].push({
          id: 10 + index,
          name: getOutcomeName(marketData, { payout: JSON.parse('['+payout+']') }),
          totalRep: 0,
          userRep: 0,
          goal: 0,
        })
      })

      // Append Invalid if not staked
      if (!normalPayouts.invalid) {
        disputeOutcomes[marketData.id].push({
          id: 100,
          name: 'Invalid',
          totalRep: 0,
          userRep: 0,
          goal: 0,
        })
      }

      // Make the tentative winning outcome come first
      disputeOutcomes[marketData.id] = tentativeWinningOutcome.concat(disputeOutcomes[marketData.id])
    })

    return disputeOutcomes
  },
)

function getOutcomeName(marketData, stakeData) {
  if (stakeData.isInvalid) return 'Invalid'

  if (marketData.marketType === BINARY) {
    if (stakeData.payout[0] === marketData.numTicks) return 'No'
    if (stakeData.payout[1] === marketData.numTicks) return 'Yes'
  }

  if (marketData.marketType === CATEGORICAL) {
    for (let i = 0; i < stakeData.payout.length; i++) {
      if (stakeData.payout[i] === marketData.numTicks) return marketData.outcomes[i].description
    }
  }

  if (marketData.marketType === SCALAR) {
    return new BigNumber(stakeData.payout[1]).mul(new BigNumber(marketData.tickSize)).add(marketData.minPrice).toString()
  }

  return ''
}

function getNormalPayouts(marketData) {
  const payouts = {
    invalid: false,
  }

  if (marketData.marketType === SCALAR) return payouts

  for (let i = 0; i < marketData.numOutcomes; i++) {
    const payout = Array(marketData.numOutcomes).fill(0)
    payout[i] = marketData.numTicks
    payouts[payout] = false
  }
  return payouts
}
