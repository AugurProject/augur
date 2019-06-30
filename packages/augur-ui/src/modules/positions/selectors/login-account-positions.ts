import { createSelector } from 'reselect';

import store from 'store';
import { selectAccountPositionsState } from 'store/select-state';
import { selectMarket } from 'modules/markets/selectors/market';
import { selectMarketPositionsSummary } from 'modules/markets/selectors/select-market-position-summary';
import { selectUserMarketPositions } from 'modules/markets/selectors/select-user-market-positions';

export default function() {
  const markets = selectLoginAccountPositionsMarkets(store.getState());

  const marketsWithPositions = markets.map(market => ({
    ...market,
    userPositions: selectUserMarketPositions(store.getState(), market.id),
    myPositionsSummary: selectMarketPositionsSummary(store.getState(), market.id)
  }));

  return {
    markets: marketsWithPositions,
  };
}

export const selectLoginAccountPositionsMarkets = createSelector(
  selectAccountPositionsState,
  positions => {
    return Object.keys(positions)
      .map(marketId => ({
        ...selectMarket(marketId)
      }))
      .filter(m => m);
  }
);
