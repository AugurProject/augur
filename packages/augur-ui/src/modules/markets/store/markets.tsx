

import React, { useReducer } from 'react';
import { DEFAULT_MARKETS_STATE, STUBBED_MARKETS_ACTIONS, MOCK_MARKETS_STATE, MARKETS_ACTIONS } from './constants';
import { useMarkets, MarketsReducer } from './markets-hooks';

const {
  UPDATE_ORDER_BOOK,
  CLEAR_ORDER_BOOK,
  UPDATE_MARKETS_DATA,
  REMOVE_MARKET
} = MARKETS_ACTIONS;

export const MarketsContext = React.createContext({
  ...DEFAULT_MARKETS_STATE,
  actions: STUBBED_MARKETS_ACTIONS,
});

export const Markets = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_MARKETS_STATE }),
  actions: STUBBED_MARKETS_ACTIONS,
};


export const MarketsProvider = ({ children }) => {
  const state = useMarkets();

  if (!Markets.actionsSet) {
    Markets.actions = state.actions;
    Markets.actionsSet = true;
  }
  const readableState = { ...state };
  delete readableState.actions;
  Markets.get = () => readableState;

  return (
    <MarketsContext.Provider value={state}>
      {children}
    </MarketsContext.Provider>
  );
};

export const useMarketsStore = () => React.useContext(MarketsContext);
