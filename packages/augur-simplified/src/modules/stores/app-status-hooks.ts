import { useReducer } from 'react';
import {
  APP_STATUS_ACTIONS,
  MOCK_APP_STATUS_STATE,
  APP_STATE_KEYS,
  // DEFAULT_APP_STATUS_STATE,
} from 'modules/stores/constants';
import { windowRef } from 'utils/window-ref';
import { getUserActvity } from 'utils/process-data';

const {
  SET_SHOW_TRADING_FORM,
  SET_IS_MOBILE,
  SET_SIDEBAR,
  UPDATE_GRAPH_DATA,
  UPDATE_PROCESSED,
  SET_LOGIN_ACCOUNT,
  UPDATE_MARKETS_VIEW_SETTINGS,
} = APP_STATUS_ACTIONS;

const {
  IS_MOBILE,
  SIDEBAR_TYPE,
  GRAPH_DATA,
  PROCESSED,
  LOGIN_ACCOUNT,
  MARKETS_VIEW_SETTINGS,
  USER_INFO,
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

export const dispatchMiddleware = (dispatch) => (action) =>
  middleware(dispatch, action);

export const keyedObjToArray = (KeyedObject: object) =>
  Object.entries(KeyedObject).map((i) => i[1]);

export const arrayToKeyedObject = (ArrayOfObj: Array<{ id: string }>) => arrayToKeyedObjectByProp(ArrayOfObj, 'id');

export const arrayToKeyedObjectByProp = (ArrayOfObj: any[], prop: string) =>
  ArrayOfObj.reduce((acc, obj) => {
    acc[obj[prop]] = obj;
    return acc;
  }, {});


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
    case SET_LOGIN_ACCOUNT: {
      updatedState[LOGIN_ACCOUNT] = action.account;

      if (updatedState.processed?.ammExchanges) {
        const activity = getUserActvity(action.account?.account, updatedState.processed?.markets, updatedState.processed?.ammExchanges);
        updatedState[USER_INFO] = {
          ...updatedState[USER_INFO],
          activity,
        }
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
        const activity = getUserActvity(updatedState?.loginAccount?.account, markets, ammExchanges);
        updatedState[USER_INFO] = {
          ...updatedState[USER_INFO],
          activity,
        }
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
    default:
      console.log(`Error: ${action.type} not caught by Markets reducer`);
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
      updateMarketsViewSettings: (marketsViewSettings) => dispatch({type: UPDATE_MARKETS_VIEW_SETTINGS, marketsViewSettings}),
      setShowTradingForm: (showTradingForm) =>
        dispatch({ type: SET_SHOW_TRADING_FORM, showTradingForm }),
      setSidebar: (sidebarType) => dispatch({ type: SET_SIDEBAR, sidebarType }),
      setIsMobile: (isMobile) => dispatch({ type: SET_IS_MOBILE, isMobile }),
      updateGraphData: (graphData) =>
        dispatch({ type: UPDATE_GRAPH_DATA, graphData }),
      updateProcessed: (processed) =>
        dispatch({ type: UPDATE_PROCESSED, processed }),
      updateLoginAccount: (account) =>
        dispatch({ type: SET_LOGIN_ACCOUNT, account }),
    },
  };
};
