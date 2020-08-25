import React, { useEffect } from 'react';
import { useMarket } from 'modules/market/store/market-hooks';
import { DEFAULT_MARKET_STATE, STUBBED_MARKET_ACTIONS } from 'modules/market/store/constants';

const MarketContext = React.createContext({
  ...DEFAULT_MARKET_STATE,
  actions: STUBBED_MARKET_ACTIONS,
});

export const Market = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_MARKET_STATE }),
  actions: STUBBED_MARKET_ACTIONS,
};

export const MarketProvider = ({ market, defaultMarket, isPreview, children }) => {
  const state = useMarket(market, { defaultMarket, isPreview });

  if (!Market.actionsSet) {
    Market.actions = state.actions;
    Market.actionsSet = true;
  }
  const readableState = { ...state };
  delete readableState.actions;
  Market.get = () => readableState;

  useEffect(() => {
    return () => window.market = null;
  }, []);

  return (
    <MarketContext.Provider value={state}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarketStore = () => React.useContext(MarketContext);