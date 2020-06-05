import React, { createContext, useContext } from 'react';
import { DEFAULT_TRADING, STUBBED_TRADING_ACTIONS } from 'modules/trading/store/constants';
import { useTrading } from 'modules/trading/store/trading-hooks';

const TradingContext = createContext({
  ...DEFAULT_TRADING,
  actions: STUBBED_TRADING_ACTIONS,
});

export const Trading = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_TRADING }),
  actions: STUBBED_TRADING_ACTIONS,
};

export const TradingProvider = ({ market, selectedOutcomeId, children }) => {
  const state = useTrading(market, selectedOutcomeId);
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