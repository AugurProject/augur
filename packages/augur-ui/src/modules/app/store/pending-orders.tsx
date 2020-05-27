import React, { createContext, useContext } from 'react';
import { DEFAULT_PENDING_ORDERS, STUBBED_PENDING_ORDERS_ACTIONS } from 'modules/app/store/constants';
import { usePendingOrders } from 'modules/app/store/pending-orders-hooks';
import { handleLocalStorage } from './local-storage-persistence';

const PendingOrdersContext = createContext({
  ...DEFAULT_PENDING_ORDERS,
  actions: STUBBED_PENDING_ORDERS_ACTIONS,
});

export const PendingOrders = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_PENDING_ORDERS }),
  actions: STUBBED_PENDING_ORDERS_ACTIONS,
};

export const PendingOrdersProvider = ({ children }) => {
  const state = usePendingOrders();
  if (!PendingOrders.actionsSet) {
    PendingOrders.actions = state.actions;
    PendingOrders.actionsSet = true;
  }
  const readableState = { ...state };
  delete readableState.actions;
  PendingOrders.get = () => readableState;
  handleLocalStorage();
  return (
    <PendingOrdersContext.Provider value={state}>
      {children}
    </PendingOrdersContext.Provider>
  );
};

export const usePendingOrdeersStore = () => useContext(PendingOrdersContext);