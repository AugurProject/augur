import { updateOrderBook } from "modules/orders/actions/update-order-book";
import logError from "utils/log-error";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { augurSdk } from "services/augursdk";

export const loadMarketOrderBook = (marketId: string, callback: NodeStyleCallback = logError) => async (
  dispatch: ThunkDispatch<void, any, Action>,
) => {
  if (marketId == null) {
    return callback("must specify market ID");
  }
  const Augur = augurSdk.get();
  const orderBook = await Augur.getMarketOrderBook({ marketId });
  dispatch(updateOrderBook(marketId, orderBook));
  callback(null, orderBook);
};
