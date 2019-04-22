import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { ungroupBy } from "utils/ungroupBy";
import { addOrphanedOrder } from "modules/orders/actions/orphaned-orders";
import { updateOrderBook } from "modules/orders/actions/update-order-book";
import { OPEN } from "modules/common-elements/constants";
import { formatEther, formatShares } from "utils/format-number";
import { shapeGetOrders } from "modules/orders/helpers/shape-getOrders";

export const loadAccountOpenOrders = (
  options = {},
  callback = logError,
  marketIdAggregator
) => dispatch => {
  dispatch(
    loadUserAccountOrders(options, (err, { marketIds = [], orders = {} }) => {
      if (!err) postProcessing(marketIds, dispatch, orders, callback);
      dispatch(
        loadAccountOrphanedOrders(options, (oMarketIds = []) => {
          const comb = [...new Set([...marketIds, oMarketIds])];
          if (marketIdAggregator && marketIdAggregator(comb));
        })
      );
    })
  );
};

const loadUserAccountOrders = (options = {}, callback) => (
  dispatch,
  getState
) => {
  const { universe, loginAccount } = getState();
  if (!options.orderState)
    options.orderState = augur.constants.ORDER_STATE.OPEN;
  augur.trading.getOrders(
    { ...options, creator: loginAccount.address, universe: universe.id },
    (err, orders) => {
      if (err) return callback(err, {});
      if (orders == null || Object.keys(orders).length === 0)
        return callback(null, {});
      callback(null, { marketIds: Object.keys(orders), orders });
    }
  );
};

const postProcessing = (marketIds, dispatch, orders, callback) => {
  marketIds.forEach(marketId =>
    shapeGetOrders(orders, marketId).map(v => dispatch(updateOrderBook(v)))
  );

  if (callback) callback(null, orders);
};

const loadAccountOrphanedOrders = (options = {}, callback) => (
  dispatch,
  getState
) => {
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
        .forEach(it =>
          dispatch(
            addOrphanedOrder({
              ...it,
              type: it.orderTypeLabel,
              description: it.description || it.outcomeName,
              sharesEscrowed: formatEther(it.sharesEscrowed),
              tokensEscrowed: formatEther(it.tokensEscrowed),
              avgPrice: formatEther(it.fullPrecisionPrice),
              unmatchedShares: formatShares(it.fullPrecisionAmount)
            })
          )
        );

      callback(err, { marketIds: Object.keys(orders) });
    }
  );
};
