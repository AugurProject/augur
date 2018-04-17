import { createSelector } from 'reselect'
import { selectMarkets } from 'modules/markets/selectors/markets-all'
import { constants } from 'services/augurjs'
import store from 'src/store'
import { isEmpty } from 'lodash'
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
    const potentialForkingMarkets = []
    const nonPotentialForkingMarkets = []
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
    return potentialForkingMarkets.concat(nonPotentialForkingMarkets)
  },
)
