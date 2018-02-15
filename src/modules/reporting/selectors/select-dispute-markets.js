import { createSelector } from 'reselect'
import { selectMarkets } from 'modules/markets/selectors/markets-all'
import { constants } from 'services/augurjs'
import store from 'src/store'

export default function () {
  return selectMarketsInDispute(store.getState())
}

export const selectMarketsInDispute = createSelector(
  selectMarkets,
  (markets) => {
    if (!markets || markets.length === 0) {
      return []
    }
    return markets.filter(market => market.reportingState === constants.REPORTING_STATE.CROWDSOURCING_DISPUTE)
  }
)
