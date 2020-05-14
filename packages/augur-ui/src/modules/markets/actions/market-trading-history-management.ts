import logError from 'utils/log-error';
import {
  NodeStyleCallback,
} from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { augurSdk } from 'services/augursdk';
import { Getters } from "@augurproject/sdk";

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

