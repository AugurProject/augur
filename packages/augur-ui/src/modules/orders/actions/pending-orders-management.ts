const blockComparison = 3;

export const ADD_PENDING_ORDER = "ADD_PENDING_ORDER";
export const REMOVE_PENDING_ORDER = "REMOVE_PENDING_ORDER";
export const LOAD_PENDING_ORDERS = "LOAD_PENDING_ORDERS";

export const loadPendingOrders = (pendingOrders: Array<any>) => ({
  type: LOAD_PENDING_ORDERS,
  data: { pendingOrders }
});

export const addPendingOrder = (pendingOrder: any, marketId: String) => ({
  type: ADD_PENDING_ORDER,
  data: {
    pendingOrder,
    marketId
  }
});

export const removePendingOrder = (id: String, marketId: String) => ({
  type: REMOVE_PENDING_ORDER,
  data: { id, marketId }
});

export const clearPendingOrders = () => (dispatch: Function, getState: Function) => {
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
