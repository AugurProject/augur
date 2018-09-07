import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { ungroupBy } from "utils/ungroupBy";
import { addOrphanedOrder } from "modules/orders/actions/orphaned-orders";
import { OPEN } from "modules/orders/constants/orders";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";

export const loadAccountOrphanedOrders = (
  options = {},
  callback = logError
) => (dispatch, getState) => {
  const { universe, loginAccount } = getState();

  augur.trading.getOrders(
    {
      ...options,
      orphaned: true,
      creator: loginAccount.address,
      universe: universe.id
    },
    (err, orders) => {
      if (err) return callback(err);
      if (orders == null || Object.keys(orders).length === 0)
        return callback(null);

      ungroupBy(orders, ["marketId", "outcome", "orderTypeLabel", "orderId"])
        .filter(it => it.orderState === OPEN)
        .forEach(it => dispatch(addOrphanedOrder(it)));

      const marketIds = Object.keys(orders);
      dispatch(
        loadMarketsInfoIfNotLoaded(marketIds, err => {
          if (err) return callback(err);
          callback(null, orders);
        })
      );
    }
  );
};
