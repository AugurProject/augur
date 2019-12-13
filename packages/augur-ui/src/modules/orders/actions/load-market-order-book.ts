import { updateOrderBook } from "modules/orders/actions/update-order-book";
import logError from "utils/log-error";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { augurSdk } from "services/augursdk";
import { AppState } from "store";

export const loadMarketOrderBook = (marketId: string, callback: NodeStyleCallback = logError) => async (
  dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState
) => {
  if (marketId == null) {
    return callback("must specify market ID");
  }
  const { loginAccount } = getState();
  const Augur = augurSdk.get();
  const marketOrderBook = await Augur.getMarketOrderBook({ marketId, account: loginAccount.address });
  dispatch(updateOrderBook(marketId, marketOrderBook.orderBook));
  callback(null, marketOrderBook);
};
