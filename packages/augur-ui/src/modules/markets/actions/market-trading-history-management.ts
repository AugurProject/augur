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
export const UPDATE_USER_OPEN_ORDERS = 'UPDATE_USER_OPEN_ORDERS';
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

export function updateUserOpenOrders(
  openOrders: Getters.Markets.Orders
) {
  return {
    type: UPDATE_USER_OPEN_ORDERS,
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
      orderState: FILLED,
      ignoreReportingStates: [REPORTING_STATE.FINALIZED]
    },
    options
  );
  const Augur = augurSdk.get();
  const userTradingHistory = await Augur.getTradingHistory(allOptions);
  const marketIds = Object.keys(userTradingHistory);
  if (marketIdAggregator) marketIdAggregator(marketIds);
  dispatch(updateUserFilledOrders(loginAccount.address, userTradingHistory));
  if (!marketIds || marketIds.length === 0) return;
  const tradingHistory = await Augur.getTradingHistory({ marketIds });
  dispatch(bulkMarketTradingHistory(tradingHistory));
};
