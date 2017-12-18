import { createSelector } from 'reselect'
import store from 'src/store'
import { selectMarkets } from 'modules/markets/selectors/markets-all'
import { selectAccountPositionsState, selectAccountTradesState } from 'src/select-state'

export default function () {
  return selectPositionsMarkets(store.getState())
}

export const selectPositionsMarkets = createSelector(
  selectMarkets,
  selectAccountPositionsState,
  selectAccountTradesState,
  (markets, positions, trades) => (markets || []).filter(market => Object.keys(positions || {}).find(positionMarketID => market.id === positionMarketID) && Object.keys(trades || {}).find(tradeMarketID => market.id === tradeMarketID))
)
