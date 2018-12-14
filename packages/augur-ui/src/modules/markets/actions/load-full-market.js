import {
  loadMarketsInfo,
  loadMarketsDisputeInfo
} from "modules/markets/actions/load-markets-info";
import loadBidsAsks from "modules/orders/actions/load-bids-asks";
import { loadAccountTrades } from "modules/positions/actions/load-account-trades";
import { loadPriceHistory } from "modules/markets/actions/price-history-management";
import { loadMarketTradingHistory } from "modules/markets/actions/market-trading-history-management";
import {
  updateMarketLoading,
  removeMarketLoading
} from "modules/markets/actions/update-market-loading";
import logError from "utils/log-error";

import {
  MARKET_FULLY_LOADING,
  MARKET_FULLY_LOADED
} from "modules/markets/constants/market-loading-states";

export const loadFullMarket = (marketId, callback = logError) => (
  dispatch,
  getState
) => {
  const { marketsData } = getState();
  dispatch(updateMarketLoading({ [marketId]: MARKET_FULLY_LOADING }));

  // if the basic data is already loaded, just load the details
  if (marketsData[marketId]) return dispatch(loadMarketDetails(marketId));

  // if the basic data hasn't loaded yet, load it first
  dispatch(
    loadMarketsInfo([marketId], err => {
      if (err) return loadingError(dispatch, callback, err, marketId);
      dispatch(loadMarketDetails(marketId, callback));
    })
  );
};

// load price history, and other non-basic market details here, dispatching
// the necessary actions to save each part in relevant state
export const loadMarketDetails = (
  marketId,
  callback = logError
) => dispatch => {
  console.log("loadBidsAsks", loadBidsAsks());

  dispatch(
    loadBidsAsks(marketId, err => {
      if (err) return loadingError(dispatch, callback, err, marketId);
      dispatch(
        loadAccountTrades({ marketId }, err => {
          if (err) return loadingError(dispatch, callback, err, marketId);
          dispatch(
            loadPriceHistory({ marketId }, err => {
              if (err) return loadingError(dispatch, callback, err, marketId);
              dispatch(
                updateMarketLoading({ [marketId]: MARKET_FULLY_LOADED })
              );
              dispatch(loadMarketTradingHistory({ marketId }));
              dispatch(loadMarketsDisputeInfo([marketId]));
              callback(null);
            })
          );
        })
      );
    })
  );
};

function loadingError(dispatch, callback, error, marketId) {
  dispatch(removeMarketLoading(marketId));
  callback(error);
}
