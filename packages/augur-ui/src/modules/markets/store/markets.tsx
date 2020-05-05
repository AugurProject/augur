

import React from 'react';
import { DEFAULT_MARKETS_STATE, STUBBED_MARKETS_ACTIONS } from './constants';
import { useMarkets } from './markets-hooks';

const MarketsContext = React.createContext({
  ...DEFAULT_MARKETS_STATE,
  actions: STUBBED_MARKETS_ACTIONS,
});

export const MarketsProvider = ({ children }) => {
  const state = useMarkets();

  return (
    <MarketsContext.Provider value={state}>
      {children}
    </MarketsContext.Provider>
  );
};

export const useMarketsStore = () => React.useContext(MarketsContext);
