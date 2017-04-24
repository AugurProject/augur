import { augur } from 'services/augurjs';
import { updateOrderStatus } from 'modules/bids-asks/actions/update-order-status';
import getOrder from 'modules/bids-asks/helpers/get-order';

import { CLOSE_DIALOG_CLOSING, CLOSE_DIALOG_FAILED } from 'modules/market/constants/close-dialog-status';

const TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS = 3000;

export function cancelOrder(orderID, marketID, type) {
  return (dispatch, getState) => {
    const { orderBooks, outcomesData, marketsData } = getState();
    const order = getOrder(orderID, marketID, type, orderBooks);
    const market = marketsData[marketID];
    if (order != null && market != null && outcomesData[marketID] != null) {
      const outcome = outcomesData[marketID][order.outcome];
      if (outcome != null) {
        dispatch(updateOrderStatus(orderID, CLOSE_DIALOG_CLOSING, marketID, type));
        augur.trading.cancel({
          trade_id: orderID,
          onSent: res => console.log('cancel sent:', res),
          onSuccess: res => console.log('cancel success:', res),
          onFailed: (err) => {
            console.error('cancel failed:', err);
            dispatch(updateOrderStatus(orderID, CLOSE_DIALOG_FAILED, marketID, type));
            setTimeout(() => dispatch(updateOrderStatus(orderID, null, marketID, type)), TIME_TO_WAIT_BEFORE_FINAL_ACTION_MILLIS);
          }
        });
      }
    }
  };
}
