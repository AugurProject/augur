import { useReducer } from 'react';
import {
  APP_STATUS_ACTIONS,
  MOCK_APP_STATUS_STATE,
  APP_STATE_KEYS,
} from './constants';
import { windowRef, Stores } from '@augurproject/augur-comps';
const {
  Utils: { dispatchMiddleware, getSavedUserInfo },
} = Stores;
const {
  SET_SHOW_TRADING_FORM,
  SET_IS_MOBILE,
  SET_SIDEBAR,
  UPDATE_MARKETS_VIEW_SETTINGS,
  UPDATE_SETTINGS,
  SET_MODAL,
  CLOSE_MODAL,
  SET_IS_LOGGED,
} = APP_STATUS_ACTIONS;

const {
  IS_MOBILE,
  SIDEBAR_TYPE,
  MARKETS_VIEW_SETTINGS,
  SETTINGS,
  MODAL,
  IS_LOGGED,
  SHOW_TRADING_FORM,
} = APP_STATE_KEYS;

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

export function AppStatusReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case SET_IS_MOBILE: {
      updatedState[IS_MOBILE] = action[IS_MOBILE];
      break;
    }
    case SET_SIDEBAR: {
      updatedState[SIDEBAR_TYPE] = action.sidebarType;
      break;
    }
    case SET_MODAL: {
      updatedState[MODAL] = action.modal;
      break;
    }
    case CLOSE_MODAL: {
      updatedState[MODAL] = {};
      break;
    }
    case SET_IS_LOGGED: {
      const { account } = action;
      updatedState[IS_LOGGED] = Boolean(account);
      if (Boolean(account)) {
        updatedState[SETTINGS] = {
          ...state[SETTINGS],
          ...getSavedUserInfo(account)[SETTINGS],
        };
      }
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
  windowRef.appStatus = updatedState;

  return updatedState;
}

export const useAppStatus = (defaultState = MOCK_APP_STATUS_STATE) => {
  const [state, pureDispatch] = useReducer(AppStatusReducer, defaultState);
  const dispatch = dispatchMiddleware(pureDispatch);
  windowRef.appStatus = state;
  return {
    ...state,
    actions: {
      updateMarketsViewSettings: (marketsViewSettings) =>
        dispatch({ type: UPDATE_MARKETS_VIEW_SETTINGS, marketsViewSettings }),
      setShowTradingForm: (showTradingForm) =>
        dispatch({ type: SET_SHOW_TRADING_FORM, showTradingForm }),
      setSidebar: (sidebarType) => dispatch({ type: SET_SIDEBAR, sidebarType }),
      setIsMobile: (isMobile) => dispatch({ type: SET_IS_MOBILE, isMobile }),
      updateSettings: (settings, account = null) =>
        dispatch({ type: UPDATE_SETTINGS, settings, account }),
      setModal: (modal) => dispatch({ type: SET_MODAL, modal }),
      closeModal: () => dispatch({ type: CLOSE_MODAL }),
      setIsLogged: (account) => dispatch({ type: SET_IS_LOGGED, account }),
    },
  };
};
