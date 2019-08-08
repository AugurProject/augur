import { UIOrder } from 'modules/types';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { isTransactionConfirmed } from 'modules/contracts/actions/contractCalls';

export const ADD_PENDING_ORDER = 'ADD_PENDING_ORDER';
export const REMOVE_PENDING_ORDER = 'REMOVE_PENDING_ORDER';
export const UPDATE_PENDING_ORDER = 'UPDATE_PENDING_ORDER';

export const addPendingOrder = (pendingOrder: UIOrder, marketId: string) => ({
  type: ADD_PENDING_ORDER,
  data: {
    pendingOrder,
    marketId,
  },
});

export const removePendingOrder = (id: string, marketId: string) => ({
  type: REMOVE_PENDING_ORDER,
  data: { id, marketId },
});

export const updatePendingOrderStatus = (
  id: string,
  marketId: string,
  status: string,
  hash: string
) => ({
  type: UPDATE_PENDING_ORDER,
  data: { id, marketId, status, hash },
});

export const loadPendingOrdersTransactions = (pendingOrders: UIOrder[]) => (
  dispatch: ThunkDispatch<void, any, Action>
) => {
  if (!pendingOrders || Object.keys(pendingOrders).length === 0) return;
  Object.keys(pendingOrders).map(async marketId => {
    const orders = pendingOrders[marketId];
    if (!orders || orders.length === 0) return;
    orders.map(async (o: UIOrder) => {
      if (!o.hash) return;
      const confirmed = await isTransactionConfirmed(o.hash);
      confirmed
        ? dispatch(removePendingOrder(o.id, marketId))
        : dispatch(addPendingOrder(o, marketId));
    });
  });
};
