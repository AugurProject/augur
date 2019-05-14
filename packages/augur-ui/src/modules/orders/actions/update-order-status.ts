import selectOrder from "modules/orders/selectors/select-order";
import { any } from "async";

export const UPDATE_ORDER_STATUS = "UPDATE_ORDER_STATUS";
export const UPDATE_ORDER_REMOVE = "UPDATE_ORDER_REMOVE";
/**
 *
 * @param {String} orderId
 * @param {String} status
 * @param {String} marketId
 * @param outcome
 * @param {String} orderTypeLabel
 */

 interface OrderStatus {
  orderId: String;
  status: String;
  marketId: String;
  outcome: any;
  orderTypeLabel: String;
 };

export const updateOrderStatus = ({
  orderId,
  status,
  marketId,
  outcome,
  orderTypeLabel
}: OrderStatus) => (dispatch: Function, getState: Function) => {
  const { orderBooks } = getState();
  const order = selectOrder(
    orderId,
    marketId,
    outcome,
    orderTypeLabel,
    orderBooks
  );
  if (order == null) {
    return warnNonExistingOrder(
      orderId,
      status,
      marketId,
      outcome,
      orderTypeLabel
    );
  }
  dispatch({
    type: UPDATE_ORDER_STATUS,
    data: {
      orderId,
      status,
      marketId,
      orderType: orderTypeLabel
    }
  });
};

export const removeCanceledOrder = (orderId: String) => (dispatch: Function) =>
  dispatch({ type: UPDATE_ORDER_REMOVE, data: { orderId } });

function warnNonExistingOrder(
  orderId: String,
  status: String,
  marketId: String,
  outcome: any,
  orderTypeLabel: String
) {
  return console.warn(
    "updateOrderStatus: can't update %o",
    orderId,
    status,
    marketId,
    outcome,
    orderTypeLabel
  );
}
