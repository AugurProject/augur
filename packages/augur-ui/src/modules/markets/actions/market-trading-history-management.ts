import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { loadReportingFinal } from "modules/reports/actions/load-reporting-final";
import { keyArrayBy } from "utils/key-by";
import { MarketTradingHistory, TradingHistory } from "modules/types";

export const UPDATE_MARKET_TRADING_HISTORY = "UPDATE_MARKET_TRADING_HISTORY";
export const UPDATE_USER_TRADING_HISTORY = "UPDATE_USER_TRADING_HISTORY";
export const UPDATE_USER_MARKET_TRADING_HISTORY =
  "UPDATE_USER_MARKET_TRADING_HISTORY";
export const BULK_MARKET_TRADING_HISTORY = "BULK_MARKET_TRADING_HISTORY";

export function bulkMarketTradingHistory(keyedMarketTradingHistory: MarketTradingHistory) {
  return {
    type: BULK_MARKET_TRADING_HISTORY,
    data: {
      keyedMarketTradingHistory
    }
  };
}

export function updateMarketTradingHistory(
  marketId: string,
  marketTradingHistory: TradingHistory,
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
  callback: Function = logError
) => (dispatch: Function, getState: Function) => {
  if (options === null || !options.marketId) return callback(null);
  getTradingHistory(options, (err: any, tradingHistory: any) => {
    if (err) return callback(err);
    if (tradingHistory == null) return callback(null);
    dispatch(updateMarketTradingHistory(options.marketId, tradingHistory));
    callback(null, tradingHistory);
  });
};

export const loadUserMarketTradingHistory = (
  options = {},
  callback = logError,
  marketIdAggregator: any
) => (dispatch: Function, getState: Function) => {
  dispatch(
    loadUserMarketTradingHistoryInternal(
      options,
      (err: any, { marketIds = [], tradingHistory = {} }: any) => {
        if (marketIdAggregator && marketIdAggregator(marketIds));
        if (callback) callback(err, tradingHistory);
      },
    ),
  );
};

export const loadUserMarketTradingHistoryInternal = (
  options: any,
  callback: Function,
) => (dispatch: Function, getState: Function) => {
  const { loginAccount, universe } = getState();
  if (!loginAccount.address) return callback(null, []);
  const allOptions = Object.assign(
    { account: loginAccount.address, universe: universe.id },
    options,
  );
  getTradingHistory(allOptions, (err: any, tradingHistory: any) => {
    if (err) return callback(err, {});
    if (tradingHistory == null) return callback(null, {});
    if (!allOptions.marketId) {
      dispatch(
        loadReportingFinal((err: any, finalizedMarkets: any) => {
          // filter out finalized markets
          if (!err && finalizedMarkets && finalizedMarkets.length > 0) {
            const userTradedMarketIds = [
              ...new Set(
                tradingHistory.reduce((p, t) => [...p, t.marketId], [])
              )
            ];
            const marketIds = [userTradedMarketIds, finalizedMarkets].reduce(
              (a, b) => a.filter((c: string) => !b.includes(c))
            );
            // getTradingHistory `marketId` can be an array
            getTradingHistory(
              { marketId: marketIds, universe: universe.id },
              (err: any, marketTradingHistories: any) => {
                const keyedMarketTradeHistory = keyArrayBy(
                  marketTradingHistories,
                  "marketId"
                );
                if (!err) {
                  dispatch(bulkMarketTradingHistory(keyedMarketTradeHistory));
                }
                callback(null, { tradingHistory, marketIds });
              }
            );
          }
        }),
      );
    }

    if (allOptions.marketId) {
      dispatch(
        updateUserMarketTradingHistory(
          loginAccount.address,
          allOptions.marketId,
          tradingHistory
        ),
      );
    } else {
      dispatch(updateUserTradingHistory(loginAccount.address, tradingHistory));
      callback(err, tradingHistory);
    }
  });
};

const getTradingHistory = (options: any, callback: Function) => {
  const allOptions = Object.assign(
    { sortBy: "timestamp", isSortDescending: true },
    options,
  );
  augur.augurNode.submitRequest(
    "getTradingHistory",
    {
      ...allOptions
    },
    (err: any, tradingHistory: any) => {
      if (err) return callback(err);
      if (tradingHistory == null) return callback(null);
      callback(null, tradingHistory);
    },
  );
};
