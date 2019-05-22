import {
  loadMarketsInfo,
  loadMarketsDisputeInfo
} from "modules/markets/actions/load-markets-info";
import { loadMarketOpenOrders } from "modules/orders/actions/load-market-open-orders";
import logError from "utils/log-error";

export const loadFullMarket = (
  marketId: string,
  callback: Function = logError
) => (dispatch: Function) => {
  // if the basic data hasn't loaded yet, load it first
  dispatch(
    loadMarketsInfo([marketId], (err: any) => {
      if (err) return callback(err);
      dispatch(
        loadMarketOpenOrders(marketId, (err: any) => {
          if (err) return callback(err);
          dispatch(loadMarketsDisputeInfo([marketId]));
          callback(null);
        })
      );
    })
  );
};
