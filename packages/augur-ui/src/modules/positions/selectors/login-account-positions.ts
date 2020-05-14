import { createSelector } from 'reselect';

import store from 'appStore';
import { selectAccountPositionsState } from 'appStore/select-state';
import { selectMarket } from 'modules/markets/selectors/market';
import { selectMarketPositionsSummary } from 'modules/markets/selectors/select-market-position-summary';
import { selectUserMarketPositions } from 'modules/markets/selectors/select-user-market-positions';
import { MarketData } from 'modules/types';
import { Markets } from 'modules/markets/store/markets';

export default function() {
  const markets: MarketData[] = selectLoginAccountPositionsMarkets(store.getState());

  const marketsWithPositions = markets.map(market => ({
    ...market,
    userPositions: selectUserMarketPositions(store.getState(), market.id),
    myPositionsSummary: selectMarketPositionsSummary(market.id)
  }));

  return {
    markets: marketsWithPositions,
  };
}

// need to add marketInfos in case positions load before markets
export const selectLoginAccountPositionsMarkets = createSelector(
  selectAccountPositionsState,
  (positions) => {
    const { marketInfos } = Markets.get();

    return Object.keys(positions)
      .reduce((p, marketId) => {
        if (!Object.keys(marketInfos).includes(marketId)) return p;
        const market = selectMarket(marketId)
        return market ? [...p, market] : p
    }, [])
  }
);
