import logError from 'utils/log-error';
import {
  NodeStyleCallback,
  MarketTradingHistoryState,
} from 'modules/types';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import {
  MarketTradingHistory,
  Orders,
} from '@augurproject/sdk/build/state/getter/Trading';
import { FILLED } from 'modules/common/constants';

export const UPDATE_MARKET_TRADING_HISTORY = 'UPDATE_MARKET_TRADING_HISTORY';
export const UPDATE_USER_FILLED_ORDERS = 'UPDATE_USER_FILLED_ORDERS';
export const UPDATE_USER_OPEN_ORDERS = 'UPDATE_USER_OPEN_ORDERS';
export const BULK_MARKET_TRADING_HISTORY = 'BULK_MARKET_TRADING_HISTORY';

export function bulkMarketTradingHistory(
  keyedMarketTradingHistory: MarketTradingHistoryState
) {
  return {
    type: BULK_MARKET_TRADING_HISTORY,
    data: {
      keyedMarketTradingHistory,
    },
  };
}

export function updateMarketTradingHistory(
  marketId: string,
  marketTradingHistory: Array<MarketTradingHistory>
) {
  return {
    type: UPDATE_MARKET_TRADING_HISTORY,
    data: {
      marketId,
      marketTradingHistory,
    },
  };
}

export function updateUserFilledOrders(
  account: string,
  userFilledOrders: Orders
) {
  return {
    type: UPDATE_USER_FILLED_ORDERS,
    data: {
      account,
      userFilledOrders,
    },
  };
}

export function updateUserOpenOrders(
  account: string,
  userOpenOrders: Orders
) {
  return {
    type: UPDATE_USER_OPEN_ORDERS,
    data: {
      account,
      userOpenOrders,
    },
  };
}

export const loadMarketTradingHistory = (
  options: any,
  callback: NodeStyleCallback = logError
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  if (options === null || !options.marketId) return callback(null);
  const Augur = augurSdk.get();
  const tradingHistory = await Augur.getTradingHistory({ ...options });
  if (tradingHistory == null) return callback(null);
  dispatch(updateMarketTradingHistory(options.marketId, tradingHistory));
  callback(null, tradingHistory);
};

export const loadUserFilledOrders = (
  options = {},
  marketIdAggregator: Function
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, universe } = getState();
  const allOptions = Object.assign(
    {
      account: loginAccount.address,
      universe: universe.id,
      orderStatus: FILLED,
    },
    options
  );
  const Augur = augurSdk.get();
  const tradingHistory = await Augur.getTradingOrders(allOptions);
  if (marketIdAggregator) marketIdAggregator(Object.keys(tradingHistory));
  updateUserFilledOrders(loginAccount.address, tradingHistory);
};
