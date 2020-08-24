import { useReducer } from 'react';
import { MOCK_MARKET_STATE } from 'modules/market/store/constants';
import {
  TRADING_TUTORIAL,
} from 'modules/common/constants';

export function MarketReducer(state, action) {
  let updatedState = { ...state };
  switch (action.type) {
    default:
      console.log('market DEFAULT:', updatedState);
  }
  window.market = updatedState;
  return updatedState;
}

export const useMarket = (market, options, defaultState = MOCK_MARKET_STATE) => {
  const [state, dispatch] = useReducer(MarketReducer, {
    ...defaultState,
    ...options,
    market,
    isTradingTutorial: market.id === TRADING_TUTORIAL,
  });
  window.market = state;
  return {
    ...state,
    actions: {},
  };
};
