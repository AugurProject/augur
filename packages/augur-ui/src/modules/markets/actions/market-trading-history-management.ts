import logError from 'utils/log-error';
import {
  NodeStyleCallback,
} from 'modules/types';
import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { FILLED, REPORTING_STATE } from 'modules/common/constants';
import { Getters } from "@augurproject/sdk";

export const UPDATE_USER_FILLED_ORDERS = 'UPDATE_USER_FILLED_ORDERS';
export const REFRESH_USER_OPEN_ORDERS = 'REFRESH_USER_OPEN_ORDERS';
export const BULK_MARKET_TRADING_HISTORY = 'BULK_MARKET_TRADING_HISTORY';

export function bulkMarketTradingHistory(
  keyedMarketTradingHistory: Getters.Markets.MarketTradingHistory
) {
  return {
    type: BULK_MARKET_TRADING_HISTORY,
    data: {
      keyedMarketTradingHistory,
    },
  };
}

export function updateUserFilledOrders(
  account: string,
  userFilledOrders: Getters.Markets.Orders
) {
  return {
    type: UPDATE_USER_FILLED_ORDERS,
    data: {
      account,
      userFilledOrders,
    },
  };
}

export function refreshUserOpenOrders(
  openOrders: Getters.Markets.Orders
) {
  return {
    type: REFRESH_USER_OPEN_ORDERS,
    data: {
      openOrders,
    },
  };
}

export const loadMarketTradingHistory = (
  marketId: string,
  callback: NodeStyleCallback = logError
) => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  if (!marketId) return callback(null);
  const Augur = augurSdk.get();
  const tradingHistory = await Augur.getTradingHistory({ marketIds: [marketId] });
  if (tradingHistory == null) return callback(null);
  dispatch(bulkMarketTradingHistory(tradingHistory));
  callback(null, tradingHistory);
};

export const loadUserFilledOrders = (
  marketId: string,
) => async (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { loginAccount, universe } = getState();
  const Augur = augurSdk.get();
  const userTradingHistory = await Augur.getTradingHistory({
    account: loginAccount.address,
    universe: universe.id,
    filterFinalized: true,
    marketIds: [marketId],
  });
  dispatch(updateUserFilledOrders(loginAccount.address, userTradingHistory));
};
