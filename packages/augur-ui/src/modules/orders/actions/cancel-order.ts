import {
  cancelZeroXOpenOrder,
  cancelZeroXOpenBatchOrders,
} from 'modules/contracts/actions/contractCalls';
import { CANCELORDER } from 'modules/common/constants';
import { addAlert } from 'modules/alerts/actions/alerts';
import { TXEventName } from '@augurproject/sdk';
import { addCanceledOrder } from 'modules/pending-queue/actions/pending-queue-management';

const BATCH_CANCEL_MAX = 4;

export const cancelAllOpenOrders = async orders => {
  let orderHashes = orders.map(order => order.id);

  try {
    orders.forEach(order => {
      sendCancelAlert(order);
    });
    if (orderHashes.length > BATCH_CANCEL_MAX) {
      var i = 0;
      while(i < orderHashes.length) {
        var orderHashesToCancel = orderHashes.slice(i, Math.min(i + BATCH_CANCEL_MAX, orderHashes.length));
        setCancelOrderStatus(orderHashesToCancel);
        await cancelZeroXOpenBatchOrders(orderHashesToCancel);
        i += BATCH_CANCEL_MAX;
      }
    }
    else {
      setCancelOrderStatus(orderHashes)
      await cancelZeroXOpenBatchOrders(orderHashes);
    }

  } catch (error) {
    console.error('Error canceling batch orders', error);
    throw error;
  }
};

export const cancelOrder = async order => {
  try {
    const { id } = order;
    sendCancelAlert(order);
    setCancelOrderStatus([id]);
    await cancelZeroXOpenOrder(id);
  } catch (error) {
    console.error('Error canceling order', error);
    throw error;
  }
};

const sendCancelAlert = (order) => {
  const { id } = order;
  addAlert({
    id,
    uniqueId: id,
    name: CANCELORDER,
    status: '',
    params: {
      ...order,
    },
  });
};

const setCancelOrderStatus = (ids: string[]) => {
  ids.map(id => addCanceledOrder(id, TXEventName.Pending, null));
}
