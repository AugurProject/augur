import { augur } from "services/augurjs";
import { updateOrderBook } from "modules/orders/actions/update-order-book";
import { shapeGetOrders } from "modules/orders/helpers/shape-getOrders";
import logError from "utils/log-error";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";

export const loadMarketOpenOrders = (marketId: string, callback: NodeStyleCallback = logError) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState,
) => {
  const { marketsData } = getState();
  if (marketId == null) {
    return callback("must specify market ID");
  }
  const market = marketsData[marketId];
  if (!market) return callback(`market ${marketId} data not found`);
  augur.trading.getOrders(
    {
      marketId,
      orderState: augur.constants.ORDER_STATE.OPEN,
    },
    (err: any, orders: any) => {
      if (err) return callback(err);
      dispatch(updateOrderBook(shapeGetOrders(orders, marketId)));
      callback(null);
    }
  );
};
