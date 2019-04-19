import { eachOf } from "async";
import { updateOrderBook } from "modules/orders/actions/update-order-book";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import logError from "utils/log-error";
import { BUY, SELL } from "modules/common-elements/constants";

export const updateSingleMarketOrderBook = updatedOrdersInMarket => (
  dispatch,
  getState
) =>
  Object.keys(updatedOrdersInMarket).forEach(outcome =>
    updatedOrdersInMarket[outcome].forEach(orderLog =>
      dispatch(
        updateOrderBook({
          marketId: orderLog.marketId,
          outcome,
          orderTypeLabel: orderLog.orderType === "buy" ? BUY : SELL,
          orderBook: { [orderLog.orderId]: orderLog }
        })
      )
    )
  );

export const updateOrdersInMarket = (
  marketId,
  updatedOrdersInMarket,
  isOrderCreation,
  callback = logError
) => (dispatch, getState) => {
  dispatch(
    loadMarketsInfoIfNotLoaded([marketId], err => {
      if (err) return callback(err);
      dispatch(updateSingleMarketOrderBook(updatedOrdersInMarket));
      callback(null);
    })
  );
};

export const updateOrder = (order, isOrderCreation, callback = logError) => (
  dispatch,
  getState
) =>
  dispatch(
    updateOrdersInMarket(
      order.marketId,
      { [order.outcome]: [order] },
      isOrderCreation,
      callback
    )
  );

export const updateOrders = (orders, isOrderCreation, callback = logError) => (
  dispatch,
  getState
) =>
  eachOf(
    orders,
    (ordersInMarket, marketId, nextMarketOrders) =>
      dispatch(
        updateOrdersInMarket(
          marketId,
          ordersInMarket,
          isOrderCreation,
          nextMarketOrders
        )
      ),
    callback
  );
