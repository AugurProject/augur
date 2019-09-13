import { MarketInfos } from 'modules/types';
import { Getters } from '@augurproject/sdk';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

export const UPDATE_MARKETS_DATA = 'UPDATE_MARKETS_DATA';
export const CLEAR_MARKETS_DATA = 'CLEAR_MARKETS_DATA';
export const UPDATE_MARKET_CATEGORY = 'UPDATE_MARKET_CATEGORY';
export const UPDATE_MARKET_REP_BALANCE = 'UPDATE_MARKET_REP_BALANCE';
export const UPDATE_MARKET_FROZEN_SHARES_VALUE =
  'UPDATE_MARKET_FROZEN_SHARES_VALUE';
export const UPDATE_MARKET_ETH_BALANCE = 'UPDATE_MARKET_ETH_BALANCE';
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
export const clearMarketsData = () => ({ type: CLEAR_MARKETS_DATA });
export const updateMarketCategory = (marketId: string, category: string) => ({
  type: UPDATE_MARKET_CATEGORY,
  data: {
    marketId,
    category,
  },
});
export const updateMarketRepBalance = (
  marketId: string,
  repBalance: string
) => ({
  type: UPDATE_MARKET_REP_BALANCE,
  data: {
    marketId,
    repBalance,
  },
});
export const updateMarketFrozenSharesValue = (
  marketId: string,
  frozenSharesValue: string
) => ({
  type: UPDATE_MARKET_FROZEN_SHARES_VALUE,
  data: {
    marketId,
    frozenSharesValue,
  },
});

export const updateMarketEthBalance = (
  marketId: string,
  ethBalance: string
) => ({
  type: UPDATE_MARKET_ETH_BALANCE,
  data: {
    marketId,
    ethBalance,
  },
});
export const removeMarket = (marketId: string) => ({
  type: REMOVE_MARKET,
  data: { marketId },
});
