import React from 'react';
import { DEFAULT_MARKETS_STATE, STUBBED_MARKETS_ACTIONS } from './constants';
import { useMarkets } from './markets-hooks';

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
