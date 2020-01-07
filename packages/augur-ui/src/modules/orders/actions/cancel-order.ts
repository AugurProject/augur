import {
  cancelZeroXOpenOrder,
  cancelZeroXOpenBatchOrders,
} from 'modules/contracts/actions/contractCalls';
import { ThunkDispatch } from 'redux-thunk';
import { CANCELORDER } from 'modules/common/constants';
import { addAlert } from 'modules/alerts/actions/alerts';
import { Action } from 'redux';

const BATCH_CANCEL_MAX = 25;

export const cancelAllOpenOrders = orders => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  let orderHashes = orders.map(order => order.id);

  if (orderHashes > BATCH_CANCEL_MAX) {
    orderHashes = orderHashes.slice(0, BATCH_CANCEL_MAX);
  }

  try {
    orders.forEach(order => {
      sendCancelAlert(order, dispatch);
    });
    await cancelZeroXOpenBatchOrders(orderHashes);
  } catch (error) {
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
