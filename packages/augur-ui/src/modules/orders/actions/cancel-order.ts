import { TXEventName } from '@augurproject/sdk-lite';
import { hash } from 'crypto-promise';
import { addAlert } from 'modules/alerts/actions/alerts';
import { BUY, CANCELORDERS } from 'modules/common/constants';
import { cancelZeroXOpenBatchOrders, cancelZeroXOpenOrder, } from 'modules/contracts/actions/contractCalls';
import { addCanceledOrder } from 'modules/pending-queue/actions/pending-queue-management';
import { string } from 'prop-types';

const BATCH_CANCEL_MAX = 4;

interface orderHash {
  hash: string;
  marketId: string;
}

export const cancelAllOpenOrders = async (orders) => {
  let orderHashes = orders.map(order => {
    return {
      hash: order.id,
      marketId: order.marketId
    }
  });
  try {
    orders.forEach((order) => {
      sendCancelAlert(order);
    });
    if (orderHashes.length > BATCH_CANCEL_MAX) {
      var i = 0;
      while(i < orderHashes.length) {
        var orderHashesToCancel = orderHashes.slice(i, Math.min(i + BATCH_CANCEL_MAX, orderHashes.length));
        setCancelOrderStatus(orderHashesToCancel);
        await cancelZeroXOpenBatchOrders(orderHashesToCancel.map(order => order.hash));
        i += BATCH_CANCEL_MAX;
      }
    } else {
      setCancelOrderStatus(orderHashes)
      await cancelZeroXOpenBatchOrders(orderHashes.map(order => order.hash));
    }
    orders.forEach(order => {
      sendCancelAlert(order);
    });
  } catch (error) {
    console.error('Error canceling batch orders', error);
    throw error;
  }
};

export const cancelOrder = async (order, marketId) => {
  try {
    const { id } = order;
    setCancelOrderStatus([{hash: id, marketId}]);
    sendCancelAlert(order);
    await cancelZeroXOpenOrder(id);
  } catch (error) {
    console.error('Error canceling order', error);
    throw error;
  }
};

const sendCancelAlert = (order) => {
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
  addAlert(alert);
};

const setCancelOrderStatus = (ids: orderHash[]) => {
  ids.map(id => addCanceledOrder(id.hash, TXEventName.Pending, '', id.marketId));
}
