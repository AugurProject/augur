import {
  loadMarketsInfo,
  loadMarketsDisputeInfo
} from "modules/markets/actions/load-markets-info";
import loadBidsAsks from "modules/orders/actions/load-bids-asks";
import logError from "utils/log-error";

export const loadFullMarket = (marketId, callback = logError) => dispatch => {
  // if the basic data hasn't loaded yet, load it first
  dispatch(
    loadMarketsInfo([marketId], err => {
      if (err) return callback(err);
      dispatch(
        loadBidsAsks(marketId, err => {
          if (err) return callback(err);
          dispatch(loadMarketsDisputeInfo([marketId]));
          callback(null);
        })
      );
    })
  );
};
