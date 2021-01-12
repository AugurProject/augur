import { useReducer } from 'react';
import {
  APP_STATUS_ACTIONS,
  MOCK_APP_STATUS_STATE,
  APP_STATE_KEYS,
  DEFAULT_APP_STATUS_STATE,
} from './constants';
import { windowRef } from 'utils/window-ref';
import { shapeUserActvity } from 'utils/process-data';
import {
  MarketInfo,
  ParaDeploys,
  TransactionDetails,
  UserBalances,
} from '../types';

const {
  SET_SHOW_TRADING_FORM,
  SET_APPROVALS,
  SET_IS_MOBILE,
  SET_SIDEBAR,
  UPDATE_GRAPH_DATA,
  UPDATE_PROCESSED,
  SET_LOGIN_ACCOUNT,
  UPDATE_MARKETS_VIEW_SETTINGS,
  UPDATE_USER_BALANCES,
  UPDATE_SETTINGS,
  ADD_TRANSACTION,
  REMOVE_TRANSACTION,
  UPDATE_BLOCKNUMBER,
  FINALIZE_TRANSACTION,
  SET_MODAL,
  CLOSE_MODAL,
  LOGOUT,
} = APP_STATUS_ACTIONS;

const {
  APPROVALS,
  IS_MOBILE,
  SIDEBAR_TYPE,
  GRAPH_DATA,
  PROCESSED,
  LOGIN_ACCOUNT,
  MARKETS_VIEW_SETTINGS,
  USER_INFO,
  SETTINGS,
  TRANSACTIONS,
  BLOCKNUMBER,
  MODAL,
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
    case SET_APPROVALS: {
      updatedState[APPROVALS] = action.approvals;
      break;
    }
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
      updatedState[TRANSACTIONS] = [];
      updatedState[LOGIN_ACCOUNT] = null;
      updatedState[APPROVALS] = DEFAULT_APP_STATUS_STATE.approvals
      updatedState[USER_INFO] = DEFAULT_APP_STATUS_STATE.userInfo
      break;
    }

    case SET_LOGIN_ACCOUNT: {
      updatedState[LOGIN_ACCOUNT] = action.account;

      if (updatedState.processed?.ammExchanges) {
        const activity = shapeUserActvity(
          action.account?.account,
          updatedState.processed?.markets,
          updatedState.processed?.ammExchanges
        );
        updatedState[USER_INFO] = {
          ...updatedState[USER_INFO],
          activity,
        };
      }
      break;
    }
    case UPDATE_GRAPH_DATA: {
      updatedState[GRAPH_DATA] = {
        markets: arrayToKeyedObject(action[GRAPH_DATA].markets),
        past: arrayToKeyedObject(action[GRAPH_DATA].past),
        paraShareTokens: arrayToKeyedObject(action[GRAPH_DATA].paraShareTokens),
      };
      break;
    }
    case SET_SHOW_TRADING_FORM: {
      updatedState['showTradingForm'] = action.showTradingForm;
      break;
    }
    case UPDATE_PROCESSED: {
      const { markets, cashes, ammExchanges } = action[PROCESSED];
      updatedState[PROCESSED] = {
        markets,
        cashes,
        ammExchanges,
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
    case ADD_TRANSACTION: {
      updatedState[TRANSACTIONS] = [
        ...updatedState[TRANSACTIONS],
        { ...action.transaction, timestamp: now }
      ];
      window.localStorage.setItem('transactions', JSON.stringify(updatedState[TRANSACTIONS]));
      break;
    }

    case REMOVE_TRANSACTION: {
      if (action.hash) {
        updatedState[TRANSACTIONS] = updatedState[TRANSACTIONS].filter(tx => tx.hash !== action.hash)
        window.localStorage.setItem('transactions', JSON.stringify(updatedState[TRANSACTIONS]));
      }
      break;
    }


    case UPDATE_BLOCKNUMBER: {
      updatedState[BLOCKNUMBER] = action.blocknumber;
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
    default:
      console.log(`Error: ${action.type} not caught by Markets reducer`);
  }
  windowRef.appStatus = updatedState;
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
      setApprovals: (approvals) => dispatch({ type: SET_APPROVALS, approvals }),
      updateGraphData: (graphData) =>
        dispatch({ type: UPDATE_GRAPH_DATA, graphData }),
      updateProcessed: (processed) =>
        dispatch({ type: UPDATE_PROCESSED, processed }),
      updateLoginAccount: (account) =>
        dispatch({ type: SET_LOGIN_ACCOUNT, account }),
      updateUserBalances: (userBalances: UserBalances) =>
        dispatch({ type: UPDATE_USER_BALANCES, userBalances }),
      updateSettings: settings => dispatch({ type: UPDATE_SETTINGS, settings }),
      addTransaction: (transaction: TransactionDetails) => dispatch({ type: ADD_TRANSACTION, transaction }),
      removeTransaction: (hash: string) => dispatch({ type: REMOVE_TRANSACTION, hash }),
      updateBlocknumber: blocknumber => dispatch({ type: UPDATE_BLOCKNUMBER, blocknumber }),
      finalizeTransaction: hash => dispatch({ type: FINALIZE_TRANSACTION, hash }),
      setModal: modal => dispatch({ type: SET_MODAL, modal }),
      closeModal: () => dispatch({ type: CLOSE_MODAL }),
      logout: () => dispatch({ type: LOGOUT }),
    },
  };
};
