import { augur } from "services/augurjs";
import { updateOrderBook } from "modules/orders/actions/update-order-book";
import { shapeGetOrders } from "modules/orders/helpers/shape-getOrders";
import logError from "utils/log-error";

export const loadMarketOpenOrders = (marketId, callback = logError) => (
  dispatch,
  getState
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
      orderState: augur.constants.ORDER_STATE.OPEN
    },
    (err, orders) => {
      if (err) return callback(err);
      if (orders != null) {
        shapeGetOrders(orders, marketId).map(v => dispatch(updateOrderBook(v)));
      }
      callback(null);
    }
  );
};
