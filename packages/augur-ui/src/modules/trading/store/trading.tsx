import React, { createContext, useContext } from 'react';
import { useTrading } from 'modules/trading/store/trading-hooks';
import { DEFAULT_TRADING_STATE, STUBBED_TRADING_ACTIONS } from 'modules/trading/store/constants';

const TradingContext = createContext({
  ...DEFAULT_TRADING_STATE,
  actions: STUBBED_TRADING_ACTIONS,
});

export const Trading = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_TRADING_STATE }),
  actions: STUBBED_TRADING_ACTIONS,
};

export const TradingProvider = ({ children }) => {
  const state = useTrading();

  if (!Trading.actionsSet) {
    Trading.actions = state.actions;
    Trading.actionsSet = true;
  }
  const readableState = { ...state };
  delete readableState.actions;
  Trading.get = () => readableState;

  return (
    <TradingContext.Provider value={state}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTradingStore = () => useContext(TradingContext);