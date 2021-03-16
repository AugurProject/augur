import { useReducer } from 'react';
import {
  SIMPLIFIED_ACTIONS,
  DEFAULT_SIMPLIFIED_STATE,
  SIMPLIFIED_STATE_KEYS,
} from './constants';
import { windowRef, Stores } from '@augurproject/augur-comps';
const {
  Utils: { dispatchMiddleware },
} = Stores;
const {
  SET_SHOW_TRADING_FORM,
  SET_SIDEBAR,
  UPDATE_MARKETS_VIEW_SETTINGS,
  UPDATE_SETTINGS,
} = SIMPLIFIED_ACTIONS;

const {
  SIDEBAR_TYPE,
  MARKETS_VIEW_SETTINGS,
  SETTINGS,
  SHOW_TRADING_FORM,
} = SIMPLIFIED_STATE_KEYS;

const updateLocalStorage = (userAccount, updatedState) => {
  const userData = JSON.parse(window.localStorage.getItem(userAccount)) || null;
  if (userData) {
    window.localStorage.setItem(
      userAccount,
      JSON.stringify({
        ...userData,
        settings: updatedState[SETTINGS],
      })
    );
  } else if (!!userAccount) {
    window.localStorage.setItem(
      userAccount,
      JSON.stringify({
        account: userAccount,
        settings: updatedState[SETTINGS],
      })
    );
  }
};

export function SimplifiedReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case SET_SIDEBAR: {
      updatedState[SIDEBAR_TYPE] = action.sidebarType;
      break;
    }
    case SET_SHOW_TRADING_FORM: {
      updatedState[SHOW_TRADING_FORM] = action.showTradingForm;
      break;
    }
    case UPDATE_MARKETS_VIEW_SETTINGS: {
      updatedState[MARKETS_VIEW_SETTINGS] = {
        ...updatedState[MARKETS_VIEW_SETTINGS],
        ...action[MARKETS_VIEW_SETTINGS],
      };
      break;
    }
    case UPDATE_SETTINGS: {
      updatedState[SETTINGS] = {
        ...state[SETTINGS],
        ...action[SETTINGS],
      };
      if (action.account) {
        updateLocalStorage(action.account, updatedState);
      }
      break;
    }
    default:
      console.log(`Error: ${action.type} not caught by App Status reducer`);
  }
  windowRef.simplified = updatedState;

  return updatedState;
}

export const useSimplified = (defaultState = DEFAULT_SIMPLIFIED_STATE) => {
  const [state, pureDispatch] = useReducer(SimplifiedReducer, defaultState);
  const dispatch = dispatchMiddleware(pureDispatch);
  windowRef.simplified = state;
  return {
    ...state,
    actions: {
      updateMarketsViewSettings: (marketsViewSettings) =>
        dispatch({ type: UPDATE_MARKETS_VIEW_SETTINGS, marketsViewSettings }),
      setShowTradingForm: (showTradingForm) =>
        dispatch({ type: SET_SHOW_TRADING_FORM, showTradingForm }),
      setSidebar: (sidebarType) => dispatch({ type: SET_SIDEBAR, sidebarType }),
      updateSettings: (settings, account = null) =>
        dispatch({ type: UPDATE_SETTINGS, settings, account }),
    },
  };
};
