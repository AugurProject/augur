import selectOrder from "modules/orders/selectors/select-order";
import { OrderStatus } from "modules/types";

export const UPDATE_ORDER_STATUS = "UPDATE_ORDER_STATUS";
export const UPDATE_ORDER_REMOVE = "UPDATE_ORDER_REMOVE";
/**
 *
 * @param {string} orderId
 * @param {string} status
 * @param {string} marketId
 * @param outcome
 * @param {string} orderTypeLabel
 */

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
      status
    }
  });
};

export const removeCanceledOrder = (orderId: string) => (dispatch: Function) =>
  dispatch({ type: UPDATE_ORDER_REMOVE, data: { orderId } });

function warnNonExistingOrder(
  orderId: string,
  status: string,
  marketId: string,
  outcome: any,
  orderTypeLabel: string
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
