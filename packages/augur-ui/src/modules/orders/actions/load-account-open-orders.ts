import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { ungroupBy } from "utils/ungroupBy";
import { addOrphanedOrder } from "modules/orders/actions/orphaned-orders";
import { updateOrderBook } from "modules/orders/actions/update-order-book";
import { OPEN } from "modules/common-elements/constants";
import { formatEther, formatShares } from "utils/format-number";
import { shapeGetOrders } from "modules/orders/helpers/shape-getOrders";

export const loadAccountOpenOrders = (
  options: any = {},
  callback: Function = logError,
  marketIdAggregator: Function
) => (dispatch: Function) => {
  dispatch(
    loadUserAccountOrders(options, (err: any, { marketIds = [], orders = {} }: any) => {
      let allMarketIds = marketIds;
      if (options.marketId) {
        allMarketIds = allMarketIds.concat([options.marketId]);
      }
      if (!err) postProcessing(allMarketIds, dispatch, orders, callback);
      dispatch(
        loadAccountOrphanedOrders(options, (oMarketIds = []) => {
          const comb = [...new Set([...marketIds, oMarketIds])];
          if (marketIdAggregator && marketIdAggregator(comb));
        })
      );
    })
  );
};

const loadUserAccountOrders = (options = {}, callback: Function) => (
  dispatch: Function,
  getState: Function
) => {
  const { universe, loginAccount } = getState();
  if (!options.orderState)
    options.orderState = augur.constants.ORDER_STATE.OPEN;
  augur.trading.getOrders(
    { ...options, creator: loginAccount.address, universe: universe.id },
    (err, orders) => {
      if (err) return callback(err, {});
      callback(null, { marketIds: Object.keys(orders), orders });
    }
  );
};

const postProcessing = (marketIds: Array<String>, dispatch: Function, orders: any, callback: Function | undefined) => {
  marketIds.forEach(marketId =>
    dispatch(updateOrderBook(shapeGetOrders(orders, marketId)))
  );

  if (callback) callback(null, orders);
};

const loadAccountOrphanedOrders = (options: any = {}, callback: Function) => (
  dispatch: Function,
  getState: Function
) => {
  const { universe, loginAccount } = getState();

  augur.trading.getOrders(
    {
      ...options,
      orphaned: true,
      creator: loginAccount.address,
      universe: universe.id
    },
    (err: any, orders: any) => {
      if (err) return callback(err);
      if (orders == null || Object.keys(orders).length === 0)
        return callback(null);

      ungroupBy(orders, ["marketId", "outcome", "orderTypeLabel", "orderId"])
        .filter((it: any) => it.orderState === OPEN)
        .forEach((it: any) =>
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
