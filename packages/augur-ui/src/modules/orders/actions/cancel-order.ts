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

export const cancelAllOpenOrders = (orders: any, cb: Function) => (
  dispatch: Function,
  getState: Function
) => {
  eachOf(orders, (order: any) => order.cancelOrder(order));
};

export const cancelOrder = (
  { orderId, marketId, outcome, orderTypeLabel }: any,
  callback = logError
) => (dispatch: Function, getState: Function) => {
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
    const updateStatus = (status: string | null) => {
      dispatch(
        updateOrderStatus({
          orderId,
          status,
          marketId,
          outcome,
          orderTypeLabel
        })
      );
    };
    updateStatus(CLOSE_DIALOG_PENDING);
    augur.api.CancelOrder.cancelOrder({
      meta: loginAccount.meta,
      _orderId: orderId,
      onSent: () => updateStatus(CLOSE_DIALOG_PENDING),
      onSuccess: () => {
        updateStatus(CLOSE_DIALOG_CLOSING);
        callback(null);
      },
      onFailed: (err: any) => {
        updateStatus(CLOSE_DIALOG_FAILED);
        setTimeout(
          () => updateStatus(null),
          TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS
        );
        callback(err);
      }
    });
  }
};
