import {
  loadMarketsInfo,
  loadMarketsDisputeInfo
} from "modules/markets/actions/load-markets-info";
import { loadMarketOrderBook } from "modules/orders/actions/load-market-order-book";
import logError from "utils/log-error";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const loadFullMarket = (
  marketId: string,
  callback: NodeStyleCallback = logError
) => (dispatch: ThunkDispatch<void, any, Action>) => {
  // if the basic data hasn't loaded yet, load it first
  dispatch(
    loadMarketsInfo([marketId], (err: any) => {
      if (err) return callback(err);
      dispatch(
        loadMarketOrderBook(marketId, (err: string | Error) => {
          if (err) return callback(err);
          dispatch(loadMarketsDisputeInfo([marketId]));
          callback(null);
        })
      );
    })
  );
};
