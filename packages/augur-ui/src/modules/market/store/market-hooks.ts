import { useReducer } from 'react';
import { MOCK_MARKET_STATE } from 'modules/market/store/constants';
import {
  TRADING_TUTORIAL,
} from 'modules/common/constants';
// if (tradingTutorial) {
//   // TODO move trading tutorial market state to constants
//   market = {
//     ...deepClone<NewMarket>(EMPTY_STATE),
//     id: TRADING_TUTORIAL,
//     description:
//       'Which NFL team will win: Los Angeles Rams vs New England Patriots Scheduled start time: October 27, 2019 1:00 PM ET',
//     numOutcomes: 4,
//     defaultSelectedOutcomeId: 1,
//     marketType: CATEGORICAL,
//     endTimeFormatted: convertUnixToFormattedDate(1668452763),
//     creationTimeFormatted: convertUnixToFormattedDate(1573585563),
//     outcomesFormatted: TRADING_TUTORIAL_OUTCOMES,
//     groupedTradeHistory: TUTORIAL_TRADING_HISTORY,
//     orderBook: TUTORIAL_ORDER_BOOK,
//   };

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
