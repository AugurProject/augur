import React, { createContext, useContext } from 'react';
import { useTrading } from 'modules/trading/store/trading-hooks';
import { DEFAULT_TRADING_STATE, STUBBED_TRADING_ACTIONS } from 'modules/trading/store/constants';

const TradingContext = createContext({
  ...DEFAULT_TRADING_STATE,
  actions: STUBBED_TRADING_ACTIONS,
});

export const Trading = {
  get: () => ({ ...DEFAULT_TRADING_STATE }),
  actions: () =>({ ...STUBBED_TRADING_ACTIONS }),
};

export const TradingProvider = ({ presetOrderProperties, children }) => {
  const state = useTrading(presetOrderProperties);
  const readableState = { ...state };
  Trading.actions = () => readableState.actions;
  delete readableState.actions;
  Trading.get = () => readableState;

  return (
    <TradingContext.Provider value={state}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTradingStore = () => useContext(TradingContext);