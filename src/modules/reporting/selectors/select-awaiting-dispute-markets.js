import { createSelector } from 'reselect'
import { createBigNumber } from 'utils/create-big-number'
import { selectMarkets } from 'modules/markets/selectors/markets-all'
import { constants } from 'services/augurjs'
import store from 'src/store'
import { isEmpty, orderBy } from 'lodash'
import selectDisputeOutcomes from 'modules/reporting/selectors/select-market-dispute-outcomes'
import { selectUniverseState } from 'src/select-state'

export default function () {
  return selectMarketsAwaitingDispute(store.getState())
}

export const selectMarketsAwaitingDispute = createSelector(
  selectMarkets,
  selectDisputeOutcomes,
  selectUniverseState,
  (markets, disputeOutcomes, universe) => {
    if (isEmpty(markets)) {
      return []
    }
    const filteredMarkets = markets.filter(market => market.reportingState === constants.REPORTING_STATE.AWAITING_NEXT_WINDOW && market.id !== universe.forkingMarket)
    // Potentially forking markets come first
    let potentialForkingMarkets = []
    let nonPotentialForkingMarkets = []
    filteredMarkets.forEach((market) => {
      const outcomes = disputeOutcomes[market.id] || []
      let potentialFork = false
      outcomes.forEach((outcome, index) => {
        if (outcome.potentialFork) {
          potentialFork = true
        }
      })
      if (potentialFork) {
        potentialForkingMarkets.push(market)
      } else {
        nonPotentialForkingMarkets.push(market)
      }
    })

    // Sort disputed markets by: 1) dispute round, and 2) highest percent staked in non-tentative-winning outcome
    Object.keys(potentialForkingMarkets).forEach((marketKey) => {
      if (potentialForkingMarkets[marketKey].disputeInfo) {
        potentialForkingMarkets[marketKey].disputeInfo.highestPercentStaked = createBigNumber(0)
        Object.keys(potentialForkingMarkets[marketKey].disputeInfo.stakes).forEach((stakeKey) => {
          if (!potentialForkingMarkets[marketKey].disputeInfo.stakes[stakeKey].tentativeWinning) {
            const percentStakedInOutcome = createBigNumber(potentialForkingMarkets[marketKey].disputeInfo.stakes[stakeKey].stakeCurrent)
              .div(createBigNumber(potentialForkingMarkets[marketKey].disputeInfo.stakes[stakeKey].bondSizeCurrent))
            if (percentStakedInOutcome.gt(potentialForkingMarkets[marketKey].disputeInfo.highestPercentStaked)) {
              potentialForkingMarkets[marketKey].disputeInfo.highestPercentStaked = percentStakedInOutcome
            }
          }
          potentialForkingMarkets[marketKey].disputeInfo.highestPercentStaked = potentialForkingMarkets[marketKey].disputeInfo.highestPercentStaked.toString()
        })
      }
    })
    potentialForkingMarkets = orderBy(potentialForkingMarkets, ['disputeInfo.disputeRound', 'disputeInfo.highestPercentStaked'], ['desc', 'desc'])

    Object.keys(nonPotentialForkingMarkets).forEach((marketKey) => {
      if (nonPotentialForkingMarkets[marketKey].disputeInfo) {
        nonPotentialForkingMarkets[marketKey].disputeInfo.highestPercentStaked = createBigNumber(0)
        Object.keys(nonPotentialForkingMarkets[marketKey].disputeInfo.stakes).forEach((stakeKey) => {
          if (!nonPotentialForkingMarkets[marketKey].disputeInfo.stakes[stakeKey].tentativeWinning) {
            const percentStakedInOutcome = createBigNumber(nonPotentialForkingMarkets[marketKey].disputeInfo.stakes[stakeKey].stakeCurrent)
              .div(createBigNumber(nonPotentialForkingMarkets[marketKey].disputeInfo.stakes[stakeKey].bondSizeCurrent))
            if (percentStakedInOutcome.gt(nonPotentialForkingMarkets[marketKey].disputeInfo.highestPercentStaked)) {
              nonPotentialForkingMarkets[marketKey].disputeInfo.highestPercentStaked = percentStakedInOutcome
            }
          }
          nonPotentialForkingMarkets[marketKey].disputeInfo.highestPercentStaked = nonPotentialForkingMarkets[marketKey].disputeInfo.highestPercentStaked.toString()
        })
      }
    })
    nonPotentialForkingMarkets = orderBy(nonPotentialForkingMarkets, ['disputeInfo.disputeRound', 'disputeInfo.highestPercentStaked'], ['desc', 'desc'])

    return potentialForkingMarkets.concat(nonPotentialForkingMarkets)
  },
)
