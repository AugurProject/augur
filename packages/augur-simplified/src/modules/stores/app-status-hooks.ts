import { useReducer } from 'react';
import {
  APP_STATUS_ACTIONS,
  MOCK_APP_STATUS_STATE,
  APP_STATE_KEYS,
  DEFAULT_APP_STATUS_STATE,
} from './constants';
import { windowRef } from '../../utils/window-ref';
import { shapeUserActvity } from '../../utils/process-data';
import {
  MarketInfo,
  ParaDeploys,
  TransactionDetails,
  UserBalances,
} from '../types';

const {
  SET_SHOW_TRADING_FORM,
  SET_IS_MOBILE,
  SET_SIDEBAR,
  SET_LOGIN_ACCOUNT,
  UPDATE_MARKETS_VIEW_SETTINGS,
  UPDATE_USER_BALANCES,
  UPDATE_SETTINGS,
  UPDATE_TRANSACTION,
  ADD_TRANSACTION,
  REMOVE_TRANSACTION,
  FINALIZE_TRANSACTION,
  SET_MODAL,
  CLOSE_MODAL,
  LOGOUT,
  UPDATE_GRAPH_HEARTBEAT,
  UPDATE_SEEN_POSITION_WARNING,
  ADD_SEEN_POSITION_WARNINGS,
} = APP_STATUS_ACTIONS;

const {
  IS_MOBILE,
  SIDEBAR_TYPE,
  PROCESSED,
  LOGIN_ACCOUNT,
  MARKETS_VIEW_SETTINGS,
  USER_INFO,
  SETTINGS,
  TRANSACTIONS,
  BLOCKNUMBER,
  MODAL,
  IS_LOGGED,
  SHOW_TRADING_FORM,
  SEEN_POSITION_WARNINGS,
} = APP_STATE_KEYS;

const isAsync = (obj) => {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    obj.constructor.name === 'AsyncFunction'
  );
};

const isPromise = (obj) => {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
};

const middleware = (dispatch, action) => {
  if (action.payload && isAsync(action.payload)) {
    (async () => {
      const v = await action.payload();
      dispatch({ ...action, payload: v });
    })();
  } else if (action.payload && isPromise(action.payload)) {
    action.payload.then((v) => {
      dispatch({ ...action, payload: v });
    });
  } else {
    dispatch({ ...action });
  }
};

const updateLocalStorage = (userAccount, updatedState) => {
  const userData = JSON.parse(window.localStorage.getItem(userAccount)) || null;
  if (userData) {
    window.localStorage.setItem(
      userAccount,
      JSON.stringify({
        ...userData,
        seenPositionWarnings: updatedState[SEEN_POSITION_WARNINGS],
        settings: updatedState[SETTINGS],
        transactions: updatedState[TRANSACTIONS],
      })
    );
  } else if (!!userAccount) {
    window.localStorage.setItem(
      userAccount,
      JSON.stringify({
        account: userAccount,
        seenPositionWarnings: updatedState[SEEN_POSITION_WARNINGS],
        settings: updatedState[SETTINGS],
        transactions: updatedState[TRANSACTIONS],
      })
    );
  }
};

const getSavedUserInfo = (account) =>
  JSON.parse(window.localStorage.getItem(account)) || null;

export const getRelatedMarkets = (
  market: MarketInfo,
  markets: Array<MarketInfo>
) =>
  keyedObjToKeyArray(markets)
    .filter((mrkt) => mrkt.includes(market.marketId))
    .map((mid) => markets[mid]);

export const getCurrentAmms = (
  market: MarketInfo,
  markets: Array<MarketInfo>
) => getRelatedMarkets(market, markets).map((m) => m.amm.cash.name);

export const dispatchMiddleware = (dispatch) => (action) =>
  middleware(dispatch, action);

export const keyedObjToArray = (KeyedObject: object) =>
  Object.entries(KeyedObject).map((i) => i[1]);

export const keyedObjToKeyArray = (KeyedObject: object) =>
  Object.entries(KeyedObject).map((i) => i[0]);

export const arrayToKeyedObject = (ArrayOfObj: Array<{ id: string }>) =>
  arrayToKeyedObjectByProp(ArrayOfObj, 'id');

export const arrayToKeyedObjectByProp = (ArrayOfObj: any[], prop: string) =>
  ArrayOfObj.reduce((acc, obj) => {
    acc[obj[prop]] = obj;
    return acc;
  }, {});

export function AppStatusReducer(state, action) {
  const updatedState = { ...state };
  const now = new Date().getTime();

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
    case LOGOUT: {
      updatedState[IS_LOGGED] = false;
      updatedState[TRANSACTIONS] = [];
      updatedState[LOGIN_ACCOUNT] = null;
      updatedState[USER_INFO] = DEFAULT_APP_STATUS_STATE.userInfo;
      break;
    }
    case SET_LOGIN_ACCOUNT: {
      const address = action?.account?.account;
      updatedState[LOGIN_ACCOUNT] = action?.account;
      updatedState[IS_LOGGED] = !!address;
      const savedInfo = getSavedUserInfo(address);

      if (updatedState.processed?.ammExchanges) {
        const activity = shapeUserActvity(
          address,
          updatedState.processed?.markets,
          updatedState.processed?.ammExchanges
        );
        updatedState[USER_INFO] = {
          ...updatedState[USER_INFO],
          activity,
        };
      }

      if (savedInfo) {
        updatedState[SETTINGS] = {
          ...state.settings,
          ...savedInfo.settings,
        };
        updatedState[SEEN_POSITION_WARNINGS] =
          savedInfo?.seenPositionWarnings || state[SEEN_POSITION_WARNINGS];
        const accTransactions = savedInfo.transactions.map((t) => ({ ...t, timestamp: now }));
        updatedState[TRANSACTIONS] = accTransactions;
      } else if (!!address && action?.account?.library?.provider?.isMetamask) {
        // no saved info for this account, must be first login...
        window.localStorage.setItem(address, JSON.stringify({ account: address }));
      }
      break;
    }
    case SET_SHOW_TRADING_FORM: {
      updatedState[SHOW_TRADING_FORM] = action.showTradingForm;
      break;
    }
    case UPDATE_GRAPH_HEARTBEAT: {
      const { markets, cashes, ammExchanges } = action[PROCESSED];
      updatedState[PROCESSED] = {
        markets,
        cashes,
        ammExchanges,
        errors: action?.errors || null,
      };
      if (updatedState?.loginAccount?.account) {
        const activity = shapeUserActvity(
          updatedState?.loginAccount?.account,
          markets,
          ammExchanges
        );
        updatedState[USER_INFO] = {
          ...updatedState[USER_INFO],
          activity,
        };
      }
      updatedState[BLOCKNUMBER] = action.blocknumber;
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
      break;
    }
    case UPDATE_USER_BALANCES: {
      updatedState[USER_INFO].balances = action.userBalances;
      break;
    }
    case UPDATE_TRANSACTION: {
      const transactionIndex = updatedState[TRANSACTIONS].findIndex(
        (transaction) => transaction.hash === action.hash
      );
      if (transactionIndex >= 0) {
        updatedState[TRANSACTIONS][transactionIndex] = {
          ...updatedState[TRANSACTIONS][transactionIndex],
          ...action.updates,
          timestamp: now,
        };
      }
      break;
    }
    case ADD_TRANSACTION: {
      updatedState[TRANSACTIONS] = [
        ...updatedState[TRANSACTIONS],
        { ...action.transaction, timestamp: now },
      ];
      break;
    }
    case REMOVE_TRANSACTION: {
      if (action.hash) {
        updatedState[TRANSACTIONS] = updatedState[TRANSACTIONS].filter(
          (tx) => tx.hash !== action.hash
        );
      }
      break;
    }
    case FINALIZE_TRANSACTION: {
      updatedState[TRANSACTIONS].forEach((tx) => {
        if (tx.hash === action.hash) {
          tx.confirmedTime = now;
        }
      });
      break;
    }
    case UPDATE_SEEN_POSITION_WARNING: {
      updatedState[SEEN_POSITION_WARNINGS][action.id] =
        action.seenPositionWarning;
      break;
    }
    case ADD_SEEN_POSITION_WARNINGS: {
      updatedState[SEEN_POSITION_WARNINGS] = action.seenPositionWarnings;
      break;
    }
    default:
      console.log(`Error: ${action.type} not caught by App Status reducer`);
  }
  windowRef.appStatus = updatedState;
  const userAccount = updatedState[LOGIN_ACCOUNT]?.account;
  if (userAccount) {
    updateLocalStorage(userAccount, updatedState);
  }
  return updatedState;
}

// @ts-ignore
const paraConfig: ParaDeploys = process.env.CONFIGURATION || {};

export const useAppStatus = (defaultState = MOCK_APP_STATUS_STATE) => {
  const [state, pureDispatch] = useReducer(AppStatusReducer, {
    ...defaultState,
    paraConfig,
  });
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
      updateLoginAccount: (account) =>
        dispatch({ type: SET_LOGIN_ACCOUNT, account }),
      updateUserBalances: (userBalances: UserBalances) =>
        dispatch({ type: UPDATE_USER_BALANCES, userBalances }),
      updateSettings: (settings) =>
        dispatch({ type: UPDATE_SETTINGS, settings }),
      updateTransaction: (hash, updates) =>
        dispatch({ type: UPDATE_TRANSACTION, hash, updates }),
      addTransaction: (transaction: TransactionDetails) =>
        dispatch({ type: ADD_TRANSACTION, transaction }),
      removeTransaction: (hash: string) =>
        dispatch({ type: REMOVE_TRANSACTION, hash }),
      updateGraphHeartbeat: (processed, blocknumber, errors) =>
        dispatch({
          type: UPDATE_GRAPH_HEARTBEAT,
          processed,
          blocknumber,
          errors,
        }),
      finalizeTransaction: (hash) =>
        dispatch({ type: FINALIZE_TRANSACTION, hash }),
      setModal: (modal) => dispatch({ type: SET_MODAL, modal }),
      closeModal: () => dispatch({ type: CLOSE_MODAL }),
      updateSeenPositionWarning: (id, seenPositionWarning) =>
        dispatch({
          type: UPDATE_SEEN_POSITION_WARNING,
          id,
          seenPositionWarning,
        }),
      addSeenPositionWarnings: (seenPositionWarnings) =>
        dispatch({ type: ADD_SEEN_POSITION_WARNINGS, seenPositionWarnings }),
      logout: () => dispatch({ type: LOGOUT }),
    },
  };
};
