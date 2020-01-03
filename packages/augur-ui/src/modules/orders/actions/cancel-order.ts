import { AppState } from 'store';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback } from 'modules/types';
import {
  cancelOpenOrders,
  cancelOpenOrder,
} from 'modules/contracts/actions/contractCalls';

export const cancelAllOpenOrders = (orders: any, cb: NodeStyleCallback) => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  // TODO: need to figure out max number of orders that can be cancelled at one time
  cancelOpenOrders(orders.map(o => o.id));
  if (cb) cb(null);
};

export const cancelOrder = async (orderId: string) => {
  try {
    await cancelOpenOrder(orderId);
  }
  catch (error) {
    console.error('Error canceling order', error);
    throw error;
  }
};
