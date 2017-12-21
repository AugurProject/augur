import { createSelector } from 'reselect'
import store from 'src/store'
import { selectMarkets } from 'modules/markets/selectors/markets-all'
import { selectAllUserOpenOrderMarkets } from 'modules/user-open-orders/selectors/user-open-orders'
import { selectAccountPositionsState } from 'src/select-state'

export default function () {
  return selectPositionsMarkets(store.getState())
}

export const selectPositionsMarkets = createSelector(
  selectMarkets,
  selectAccountPositionsState,
  selectAllUserOpenOrderMarkets,
  (markets, positions, marketIDs) => (markets || []).filter(market => Object.keys(positions || {}).find(positionMarketID => market.id === positionMarketID) || (marketIDs || {}).find(marketID => market.id === marketID))
)
