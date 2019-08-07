import { UIOrder } from "modules/types";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { AppState } from "store";
import { isTransactionConfirmed } from "modules/contracts/actions/contractCalls";

const blockComparison = 3;

export const ADD_PENDING_ORDER = "ADD_PENDING_ORDER";
export const REMOVE_PENDING_ORDER = "REMOVE_PENDING_ORDER";
export const LOAD_PENDING_ORDERS = "LOAD_PENDING_ORDERS";
export const UPDATE_PENDING_ORDER = "UPDATE_PENDING_ORDER";

const loadPendingOrders = (pendingOrders: Array<UIOrder>) => ({
  type: LOAD_PENDING_ORDERS,
  data: { pendingOrders },
});

export const addPendingOrder = (pendingOrder: UIOrder, marketId: string) => ({
  type: ADD_PENDING_ORDER,
  data: {
    pendingOrder,
    marketId,
  }
});

export const removePendingOrder = (id: string, marketId: string) => ({
  type: REMOVE_PENDING_ORDER,
  data: { id, marketId }
});

export const updatePendingOrderStatus = (id: string, marketId: string, status: string, hash: string) => ({
  type: UPDATE_PENDING_ORDER,
  data: { id, marketId, status, hash }
});

export const clearPendingOrders = () => (
  dispatch: ThunkDispatch<void, any, Action>,
  getState: () => AppState
) => {
  const { blockchain, pendingOrders } = getState();

  if (blockchain.currentBlockNumber) {
    Object.keys(pendingOrders).forEach(marketId => {
      pendingOrders[marketId] = pendingOrders[marketId].filter(
        (order: any) =>
          order &&
          order.blockNumber + blockComparison > blockchain.currentBlockNumber
      );

      if (!pendingOrders[marketId].length) {
        delete pendingOrders[marketId];
      }
    });
  }

  dispatch(loadPendingOrders(pendingOrders));
};

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
      if (confirmed) return;
      dispatch(loadPendingOrders([o]))
    })
  })
}
