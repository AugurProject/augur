import {
  cancelZeroXOpenOrder,
  cancelZeroXOpenBatchOrders,
} from 'modules/contracts/actions/contractCalls';

export const cancelAllOpenOrders = async (orders) => {
  const orderHashes = orders.map(order => order.id);
  try {
    await cancelZeroXOpenBatchOrders(orderHashes);
  }
  catch (error) {
    console.error('Error canceling batch orders', error);
    throw error;
  }
};

export const cancelOrder = async (orderId: string) => {
  try {
    await cancelZeroXOpenOrder(orderId);
  }
  catch (error) {
    console.error('Error canceling order', error);
    throw error;
  }
};
