import { TXEventName } from '@augurproject/sdk-lite';
import { addAlert } from 'modules/alerts/actions/alerts';
import { BUY, CANCELORDERS } from 'modules/common/constants';
import { cancelZeroXOpenBatchOrders, cancelZeroXOpenOrder, } from 'modules/contracts/actions/contractCalls';
import { addCanceledOrder } from 'modules/pending-queue/actions/pending-queue-management';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

const BATCH_CANCEL_MAX = 4;

export const cancelAllOpenOrders = orders => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  let orderHashes = orders.map(order => order.id);

  try {
    orders.forEach((order) => {
      sendCancelAlert(order, dispatch);
    });
    if (orderHashes.length > BATCH_CANCEL_MAX) {
      let i = 0;
      while (i < orderHashes.length) {
        let orderHashesToCancel = orderHashes.slice(i, Math.min(i + BATCH_CANCEL_MAX, orderHashes.length));
        dispatch(setCancelOrderStatus(orderHashesToCancel));
        await cancelZeroXOpenBatchOrders(orderHashesToCancel);
        i += BATCH_CANCEL_MAX;
      }
    } else {
      dispatch(setCancelOrderStatus(orderHashes));
      await cancelZeroXOpenBatchOrders(orderHashes);
    }
  } catch (error) {
    console.error('Error canceling batch orders', error);
    dispatch(setCancelOrderStatus(orders.map(o => o.id), TXEventName.Failure));
    throw error;
  }
};

export const cancelOrder = order => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  try {
    const { id } = order;
    dispatch(setCancelOrderStatus([id]));
    sendCancelAlert(order, dispatch);
    await cancelZeroXOpenOrder(id);
  } catch (error) {
    console.error('Error canceling order', error);
    throw error;
  }
};

const sendCancelAlert = (order, dispatch) => {
  const { id, marketDescription, outcomeId, type } = order;
  const buyOrSell = type === BUY ? 0 : 1;
  const alert = {
    id: id,
    uniqueId: id,
    name: CANCELORDERS,
    status: TXEventName.Pending,
    description: marketDescription,
    params: {
      ...order,
      outcome: '0x0'.concat(String(outcomeId)),
      orderType: buyOrSell,
    },
  };
  dispatch(addAlert(alert));
};

const setCancelOrderStatus = (ids: string[], status: string = TXEventName.Pending) => dispatch => {
  ids.map(id => dispatch(addCanceledOrder(id, status, null)))
};
