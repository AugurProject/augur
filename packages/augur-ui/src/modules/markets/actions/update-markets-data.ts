import type { Getters } from '@augurproject/sdk';
import { MarketInfos } from 'modules/types';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

export const UPDATE_MARKETS_DATA = 'UPDATE_MARKETS_DATA';
export const REMOVE_MARKET = 'REMOVE_MARKET';

export interface UpdateMarketsAction {
  type: typeof UPDATE_MARKETS_DATA;
  data: { marketInfos: MarketInfos };
}

export const addUpdateMarketInfos = (
  marketsInfo: Getters.Markets.MarketInfo[]
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  const marketInfos = marketsInfo.reduce(
    (p, m) => ({ ...p, [m.id]: m }),
    {}
  );
  dispatch(updateMarketsData(marketInfos));
};

export const updateMarketsData = (
  marketInfos: MarketInfos
): UpdateMarketsAction => ({
  type: UPDATE_MARKETS_DATA,
  data: { marketInfos },
});

export const removeMarket = (marketId: string) => ({
  type: REMOVE_MARKET,
  data: { marketId },
});
