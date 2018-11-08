import { augur } from "services/augurjs";
import {
  CLOSE_DIALOG_CLOSING,
  CLOSE_DIALOG_FAILED,
  CLOSE_DIALOG_PENDING
} from "modules/markets/constants/close-dialog-status";
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

export const cancelOpenOrdersInClosedMarkets = () => dispatch => {
  const openOrders = getOpenOrders();
  if (openOrders && openOrders.length) {
    const numMarketsWithOpenOrders = openOrders.length;
    for (let i = 0; i < numMarketsWithOpenOrders; ++i) {
      const market = openOrders[i];
      if (!market.isOpen) {
        const numOutcomes = market.outcomes.length;
        for (let j = 0; j < numOutcomes; ++j) {
          const outcome = market.outcomes[j];
          const numOrders = outcome.userOpenOrders.length;
          if (numOrders) {
            console.log(
              "found open orders:",
              outcome.id,
              outcome.userOpenOrders
            );
            for (let k = 0; k < numOrders; ++k) {
              const openOrder = outcome.userOpenOrders[k];
              console.log(
                "cancelling order:",
                cancelOrder,
                openOrder.id,
                market.id,
                outcome.id,
                openOrder.type
              );
              dispatch(
                cancelOrder({
                  orderId: openOrder.id,
                  marketId: market.id,
                  outcome: outcome.id,
                  orderTypeLabel: openOrder.type
                })
              );
            }
          }
        }
      }
    }
  }
};

function getOpenOrders() {
  return require("modules/orders/selectors/open-orders");
}
