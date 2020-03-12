import {
  cancelZeroXOpenOrder,
  cancelZeroXOpenBatchOrders,
} from 'modules/contracts/actions/contractCalls';
import { ThunkDispatch } from 'redux-thunk';
import { CANCELORDER } from 'modules/common/constants';
import { addAlert } from 'modules/alerts/actions/alerts';
import { Action } from 'redux';
import { TXEventName } from '@augurproject/sdk';
import { removeCanceledOrder, addCanceledOrder } from 'modules/pending-queue/actions/pending-queue-management';

const BATCH_CANCEL_MAX = 4;

export const cancelAllOpenOrders = orders => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  let orderHashes = orders.map(order => order.id);

  try {
    orders.forEach(order => {
      sendCancelAlert(order, dispatch);
    });
    if (orderHashes.length > BATCH_CANCEL_MAX) {
      var i = 0;
      while(i < orderHashes.length) {
        var orderHashesToCancel = orderHashes.slice(i, Math.min(i + BATCH_CANCEL_MAX, orderHashes.length));
        dispatch(setCancelOrderStatus(orderHashesToCancel));
        await cancelZeroXOpenBatchOrders(orderHashesToCancel);
        i += BATCH_CANCEL_MAX;
      }
    }
    else {
      dispatch(setCancelOrderStatus(orderHashes))
      await cancelZeroXOpenBatchOrders(orderHashes);
    }

  } catch (error) {
    orders.forEach(order => {
      dispatch(removeCanceledOrder(order.id));
    });
    console.error('Error canceling batch orders', error);
    throw error;
  }
};

export const cancelOrder = order => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  try {
    const { id } = order;
    sendCancelAlert(order, dispatch);
    dispatch(setCancelOrderStatus([id]));
    await cancelZeroXOpenOrder(id);
  } catch (error) {
    console.error('Error canceling order', error);
    throw error;
  }
};

const sendCancelAlert = (order, dispatch) => {
  const { id } = order;

  dispatch(
    addAlert({
      id,
      uniqueId: id,
      name: CANCELORDER,
      status: '',
      params: {
        ...order,
      },
    })
  );
};

const setCancelOrderStatus = (ids: string[]) => dispatch => {
  ids.map(id => dispatch(addCanceledOrder(id, TXEventName.Pending, null)))
}
