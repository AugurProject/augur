import { useReducer } from 'react';

import {
  MY_BETS_ACTIONS,
  VIEW_BY,
  SELECTED_MARKET_CARD_TYPE,
  SELECTED_MARKET_STATE_TYPE,
  BET_DATE,
  MARKET_STATUS,
  DEFAULT_MY_BETS_STATE,
} from './constants';

const {
  SET_VIEW_BY,
  SET_SELECTED_MARKET_CARD_TYPE,
  SET_SELECTED_MARKET_STATE_TYPE,
  SET_BET_DATE,
  SET_MARKET_STATUS,
} = MY_BETS_ACTIONS;

export function MyBetsReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case SET_VIEW_BY: {
      updatedState[VIEW_BY] = action.viewBy;
      break;
    }
    case SET_SELECTED_MARKET_CARD_TYPE: {
      updatedState[SELECTED_MARKET_CARD_TYPE] = action.selectedMarketCardType;
      break;
    }
    case SET_SELECTED_MARKET_STATE_TYPE: {
      updatedState[SELECTED_MARKET_STATE_TYPE] = action.selectedMarketStateType;
      break;
    }
    case SET_BET_DATE: {
      updatedState[BET_DATE] = action.betDate;
      break;
    }
    case SET_MARKET_STATUS: {
      updatedState[MARKET_STATUS] = action.marketStatus;
      break;
    }
    default:
      console.error(`Error: ${action.type} not caught by My Bets reducer.`);
  }
  console.log("my Bets update", action);
  return updatedState;
}

export const useMyBets = (defaultState = DEFAULT_MY_BETS_STATE) => {
  const [state, dispatch] = useReducer(MyBetsReducer, defaultState);
  return {
    ...state,
    actions: {
      setViewBy: viewBy => dispatch({ type: SET_VIEW_BY, viewBy }),
      setMarketStatus: marketStatus =>
        dispatch({ type: SET_MARKET_STATUS, marketStatus }),
      setBetDate: betDate => dispatch({ type: SET_BET_DATE, betDate }),
      setSelectedMarketCardType: selectedMarketCardType =>
        dispatch({
          type: SET_SELECTED_MARKET_CARD_TYPE,
          selectedMarketCardType,
        }),
      setSelectedMarketStateType: selectedMarketStateType =>
        dispatch({
          type: SET_SELECTED_MARKET_STATE_TYPE,
          selectedMarketStateType,
        }),
    },
  };
};
