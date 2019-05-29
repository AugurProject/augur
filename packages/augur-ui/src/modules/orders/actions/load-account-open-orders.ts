import { augur } from "services/augurjs";
import logError from "utils/log-error";
import { updateOrderBook } from "modules/orders/actions/update-order-book";
import { shapeGetOrders } from "modules/orders/helpers/shape-getOrders";
import { NodeStyleCallback } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

export const loadAccountOpenOrders = (
  options: any = {},
  callback: NodeStyleCallback = logError,
  marketIdAggregator: Function
) => (dispatch: ThunkDispatch<void, any, Action>) => {
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

const loadUserAccountOrders = (options = {}, callback: NodeStyleCallback) => (
  dispatch: ThunkDispatch<void, any, Action>,
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

const postProcessing = (marketIds: Array<string>, dispatch: ThunkDispatch<void, any, Action>, orders: any, callback: NodeStyleCallback | undefined) => {
  marketIds.forEach(marketId =>
    dispatch(updateOrderBook(shapeGetOrders(orders, marketId)))
  );

  if (callback) callback(null, orders);
};
