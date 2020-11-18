import logError from 'utils/log-error';
import {
  NodeStyleCallback,
} from 'modules/types';
import { augurSdk } from 'services/augursdk';
import type { Getters } from "@augurproject/sdk";

export const UPDATE_USER_FILLED_ORDERS = 'UPDATE_USER_FILLED_ORDERS';
export const REFRESH_USER_OPEN_ORDERS = 'REFRESH_USER_OPEN_ORDERS';
export const BULK_MARKET_TRADING_HISTORY = 'BULK_MARKET_TRADING_HISTORY';

export function bulkMarketTradingHistory(
  keyedMarketTradingHistory: Getters.Trading.MarketTradingHistory
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
  userFilledOrders: Getters.Trading.MarketTradingHistory
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
  openOrders: Getters.Trading.Orders
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
) => async () => {
  if (!marketId) return callback(null);
  const Augur = augurSdk.get();
  const tradingHistory = await Augur.getTradingHistory({ marketIds: [marketId] });
  if (tradingHistory == null) return callback(null);
  bulkLoadMarketTradingHistory(tradingHistory)
  callback(null, tradingHistory);
  return {keyedMarketTradingHistory: tradingHistory}
};

export const bulkLoadMarketTradingHistory = async(
  marketIds: Array<string>,
  callback: NodeStyleCallback = logError
) => {
  if (!marketIds || marketIds.length === 0) return callback(null);
  const Augur = augurSdk.get();
  const tradingHistory = await Augur.getTradingHistory({ marketIds });
  if (tradingHistory == null) return callback(null);
  callback(null, tradingHistory);
  return {keyedMarketTradingHistory: tradingHistory}
};
