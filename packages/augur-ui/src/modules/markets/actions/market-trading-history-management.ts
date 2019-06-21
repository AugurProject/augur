import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { loadReportingFinal } from "modules/reports/actions/load-reporting-final";
import { keyArrayBy } from "utils/key-by";
import { TradingHistory, NodeStyleCallback, MarketTradingHistoryState } from "modules/types";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { augurSdk } from "services/augursdk";
import { MarketTradingHistory } from "@augurproject/sdk/build/state/getter/Trading";

export const UPDATE_MARKET_TRADING_HISTORY = "UPDATE_MARKET_TRADING_HISTORY";
export const UPDATE_USER_TRADING_HISTORY = "UPDATE_USER_TRADING_HISTORY";
export const UPDATE_USER_MARKET_TRADING_HISTORY =
  "UPDATE_USER_MARKET_TRADING_HISTORY";
export const BULK_MARKET_TRADING_HISTORY = "BULK_MARKET_TRADING_HISTORY";

export function bulkMarketTradingHistory(keyedMarketTradingHistory: MarketTradingHistoryState) {
  return {
    type: BULK_MARKET_TRADING_HISTORY,
    data: {
      keyedMarketTradingHistory
    }
  };
}

export function updateMarketTradingHistory(
  marketId: string,
  marketTradingHistory: Array<MarketTradingHistory>,
) {
  return {
    type: UPDATE_MARKET_TRADING_HISTORY,
    data: {
      marketId,
      marketTradingHistory
    }
  };
}

export function updateUserTradingHistory(
  account: string,
  userFilledOrders: TradingHistory,
) {
  return {
    type: UPDATE_USER_TRADING_HISTORY,
    data: {
      account,
      userFilledOrders,
    },
  };
}

export function updateUserMarketTradingHistory(
  account: string,
  marketId: string,
  userFilledOrders: TradingHistory,
) {
  return {
    type: UPDATE_USER_MARKET_TRADING_HISTORY,
    data: {
      account,
      marketId,
      userFilledOrders
    }
  };
}

export const loadMarketTradingHistory = (
  options: any,
  callback: NodeStyleCallback = logError
) => async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  if (options === null || !options.marketId) return callback(null);
  const Augur = augurSdk.get();
  const tradingHistory = await Augur.getTradingHistory({...options});
  if (tradingHistory == null) return callback(null);
  dispatch(updateMarketTradingHistory(options.marketId, tradingHistory));
  callback(null, tradingHistory);
};

export const loadUserMarketTradingHistory = (
  options = {},
  callback: NodeStyleCallback = logError,
  marketIdAggregator: Function,
) => (dispatch: ThunkDispatch<void, any, Action>) => {
    loadUserMarketTradingHistoryInternal(
      options,
      (err: any, { marketIds = [], tradingHistory = {} }: any) => {
        if (marketIdAggregator) marketIdAggregator(marketIds);
        if (callback) callback(err, tradingHistory);
      },
    )
};

export const loadUserMarketTradingHistoryInternal = (
  options: any,
  callback: NodeStyleCallback,
) => async (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
  const { loginAccount, universe } = getState();
  const allOptions = Object.assign(
    { account: loginAccount.address, universe: universe.id },
    options,
  );
  const Augur = augurSdk.get();
  const tradingHistory = await Augur.getTradingHistory(allOptions);
  const userTradedMarketIds = [
    ...new Set(
      tradingHistory.reduce((p, t) => [...p, t.marketId], [])
    )
  ];
  callback(null, { tradingHistory, userTradedMarketIds });
};
