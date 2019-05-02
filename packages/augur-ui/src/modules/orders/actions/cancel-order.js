import { eachOf } from "async";
import { augur } from "services/augurjs";
import {
  CLOSE_DIALOG_CLOSING,
  CLOSE_DIALOG_FAILED,
  CLOSE_DIALOG_PENDING
} from "modules/common-elements/constants";
import { updateOrderStatus } from "modules/orders/actions/update-order-status";
import selectOrder from "modules/orders/selectors/select-order";
import logError from "utils/log-error";

const TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS = 3000;
// orderDetails: {
//   orderId,
//   marketId,
//   outcome,
//   orderTypeLabel,
// }

export const cancelAllOpenOrders = (orders, cb) => (dispatch, getState) => {
  eachOf(orders, order => order.cancelOrder(order));
};

export const cancelOrder = (
  { orderId, marketId, outcome, orderTypeLabel },
  callback = logError
) => (dispatch, getState) => {
  const { loginAccount, orderBooks, outcomesData, marketsData } = getState();
  const order = selectOrder(
    orderId,
    marketId,
    outcome,
    orderTypeLabel,
    orderBooks
  );
  const market = marketsData[marketId];
  if (
    order &&
    market &&
    outcomesData[marketId] &&
    outcomesData[marketId][outcome]
  ) {
    dispatch(
      updateOrderStatus({
        orderId,
        status: CLOSE_DIALOG_PENDING,
        marketId,
        outcome,
        orderTypeLabel
      })
    );
    augur.api.CancelOrder.cancelOrder({
      meta: loginAccount.meta,
      _orderId: orderId,
      onSent: () =>
        dispatch(
          updateOrderStatus({
            orderId,
            status: CLOSE_DIALOG_PENDING,
            marketId,
            outcome,
            orderTypeLabel
          })
        ),
      onSuccess: () => {
        dispatch(
          updateOrderStatus({
            orderId,
            status: CLOSE_DIALOG_CLOSING,
            marketId,
            outcome,
            orderTypeLabel
          })
        );
        callback(null);
      },
      onFailed: err => {
        dispatch(
          updateOrderStatus({
            orderId,
            status: CLOSE_DIALOG_FAILED,
            marketId,
            outcome,
            orderTypeLabel
          })
        );
        setTimeout(
          () =>
            dispatch(
              updateOrderStatus({
                orderId,
                status: null,
                marketId,
                outcome,
                orderTypeLabel
              })
            ),
          TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS
        );
        callback(err);
      }
    });
  }
};
