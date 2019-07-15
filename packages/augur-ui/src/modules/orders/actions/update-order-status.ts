import selectOrder from "modules/orders/selectors/select-order";
import { OrderStatus } from "modules/types";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";

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
}: OrderStatus) => (dispatch: ThunkDispatch<void, any, Action>, getState: () => AppState) => {
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

export const addCanceledOrder = (orderId: string, status: string) => (dispatch: ThunkDispatch<void, any, Action>) =>
dispatch({ type: UPDATE_ORDER_STATUS, data: { orderId, status } });

export const removeCanceledOrder = (orderId: string) => (dispatch: ThunkDispatch<void, any, Action>) =>
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
