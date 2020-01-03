import {
  cancelZeroXOpenOrder,
  cancelZeroXOpenBatchOrders,
} from 'modules/contracts/actions/contractCalls';
import { ThunkDispatch } from 'redux-thunk';
import { CANCELORDER } from 'modules/common/constants';
import { addAlert } from 'modules/alerts/actions/alerts';
import { Action } from 'redux';

export const cancelAllOpenOrders = orders => async (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  const orderHashes = orders.map(order => order.id);
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
