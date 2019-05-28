import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { updateOrderBook } from "modules/orders/actions/update-order-book";
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

const postProcessing = (marketIds: Array<string>, dispatch: Function, orders: any, callback: Function | undefined) => {
  marketIds.forEach(marketId =>
    dispatch(updateOrderBook(shapeGetOrders(orders, marketId)))
  );

  if (callback) callback(null, orders);
};
