import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { loadReportingFinal } from "src/modules/reports/actions/load-reporting-final";
import { keyArrayBy } from "utils/key-by";

export const UPDATE_MARKET_TRADING_HISTORY = "UPDATE_MARKET_TRADING_HISTORY";
export const UPDATE_USER_TRADING_HISTORY = "UPDATE_USER_TRADING_HISTORY";
export const BULK_MARKET_TRADING_HISTORY = "BULK_MARKET_TRADING_HISTORY";

export function bulkMarketTradingHistory(keyedMarketTradingHistory) {
  return {
    type: BULK_MARKET_TRADING_HISTORY,
    data: {
      keyedMarketTradingHistory
    }
  };
}

export function updateMarketTradingHistory(marketId, marketTradingHistory) {
  return {
    type: UPDATE_MARKET_TRADING_HISTORY,
    data: {
      marketId,
      marketTradingHistory
    }
  };
}

export function updateUserTradingHistory(account, userFilledOrders) {
  return {
    type: UPDATE_USER_TRADING_HISTORY,
    data: {
      account,
      userFilledOrders
    }
  };
}

export const loadMarketTradingHistory = (options, callback = logError) => (
  dispatch,
  getState
) => {
  if (options === null || !options.marketId) return callback(null);
  getTradingHistory(options, (err, tradingHistory) => {
    if (err) return callback(err);
    if (tradingHistory == null) return callback(null);
    dispatch(updateMarketTradingHistory(options.marketId, tradingHistory));
    callback(null, tradingHistory);
  });
};

export const loadUserMarketTradingHistory = (options, callback = logError) => (
  dispatch,
  getState
) => {
  const { loginAccount, universe } = getState();
  if (!loginAccount.address) return callback(null, []);
  const allOptions = Object.assign(
    { account: loginAccount.address, universe: universe.id },
    options
  );
  getTradingHistory(allOptions, (err, tradingHistory) => {
    if (err) return callback(err);
    if (tradingHistory == null) return callback(null, []);
    if (!allOptions.marketId) {
      dispatch(
        loadReportingFinal((err, finalizedMarkets) => {
          // filter out finalized markets
          if (!err && finalizedMarkets && finalizedMarkets.length > 0) {
            const userTradedMarketIds = [
              ...new Set(
                tradingHistory.reduce((p, t) => [...p, t.marketId], [])
              )
            ];
            const marketIds = [userTradedMarketIds, finalizedMarkets].reduce(
              (a, b) => a.filter(c => !b.includes(c))
            );
            // getTradingHistory `marketId` can be an array
            getTradingHistory(
              { marketId: marketIds, universe: universe.id },
              (err, marketTradingHistories) => {
                const keyedMarketTradeHistory = keyArrayBy(
                  marketTradingHistories,
                  "marketId"
                );
                if (!err) {
                  dispatch(bulkMarketTradingHistory(keyedMarketTradeHistory));
                }
              }
            );
          }
        })
      );
    }

    dispatch(updateUserTradingHistory(loginAccount.address, tradingHistory));
    callback(null, tradingHistory);
  });
};

const getTradingHistory = (options, callback) => {
  const allOptions = Object.assign(
    { sortBy: "timestamp", isSortDescending: true },
    options
  );
  augur.augurNode.submitRequest(
    "getTradingHistory",
    {
      ...allOptions
    },
    (err, tradingHistory) => {
      if (err) return callback(err);
      if (tradingHistory == null) return callback(null);
      callback(null, tradingHistory);
    }
  );
};
