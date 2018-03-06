import { createSelector } from 'reselect'
import { selectMarkets } from 'modules/markets/selectors/markets-all'
import { constants } from 'services/augurjs'
import store from 'src/store'
import { isEmpty } from 'lodash'

export default function () {
  return selectMarketsAwaitingDispute(store.getState())
}

export const selectMarketsAwaitingDispute = createSelector(
  selectMarkets,
  (markets) => {
    if (isEmpty(markets)) {
      return []
    }
    return markets.filter(market => market.reportingState === constants.REPORTING_STATE.AWAITING_NEXT_WINDOW)
  },
)
