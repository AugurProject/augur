import { createSelector } from 'reselect'
import { selectMarkets } from 'modules/markets/selectors/markets-all'
import { constants } from 'services/augurjs'
import store from 'src/store'
import { isEmpty } from 'lodash'
import selectDisputeOutcomes from 'modules/reporting/selectors/select-market-dispute-outcomes'
import { selectUniverseState } from 'src/select-state'

export default function () {
  return selectMarketsInDispute(store.getState())
}

export const selectMarketsInDispute = createSelector(
  selectMarkets,
  selectDisputeOutcomes,
  selectUniverseState,
  (markets, disputeOutcomes, universe) => {
    if (isEmpty(markets)) {
      return []
    }
    const filteredMarkets = markets.filter(market => market.reportingState === constants.REPORTING_STATE.AWAITING_FORK_MIGRATION || market.reportingState === constants.REPORTING_STATE.CROWDSOURCING_DISPUTE || market.id === universe.forkingMarket)
    // Potentially forking or forking markets come first
    const potentialForkingMarkets = []
    const nonPotentialForkingMarkets = []
    let forkingMarket = null
    filteredMarkets.forEach((market) => {
      if (market.id === universe.forkingMarket) {
        forkingMarket = market
        return
      }
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
    const orderedMarkets = potentialForkingMarkets.concat(nonPotentialForkingMarkets)
    if (!universe.isForking) return orderedMarkets
    return [forkingMarket].concat(orderedMarkets)
  },
)
