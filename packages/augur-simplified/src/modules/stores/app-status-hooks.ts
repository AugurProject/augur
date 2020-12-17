import { useReducer } from 'react';
import {
  APP_STATUS_ACTIONS,
  MOCK_APP_STATUS_STATE,
  APP_STATE_KEYS,
  // DEFAULT_APP_STATUS_STATE,
} from 'modules/stores/constants';
import { windowRef } from 'utils/window-ref';

const {
  SET_SHOW_TRADING_FORM,
  SET_IS_MOBILE,
  SET_SIDEBAR,
  UPDATE_GRAPH_DATA,
} = APP_STATUS_ACTIONS;

const { IS_MOBILE, FILTER_SIDEBAR, GRAPH_DATA } = APP_STATE_KEYS;

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

export const keyedObjToArray = (KeyedObject) =>
  Object.entries(KeyedObject).map((i) => i[1]);

export function AppStatusReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case SET_IS_MOBILE: {
      updatedState[IS_MOBILE] = action[IS_MOBILE];
      break;
    }
    case SET_SIDEBAR: {
      updatedState['sidebarType'] = action.sidebarType;
      break;
    }
    case UPDATE_GRAPH_DATA: {
      updatedState[GRAPH_DATA] = action[GRAPH_DATA];
      break;
    }
    case SET_SHOW_TRADING_FORM: {
      updatedState['showTradingForm'] = action.showTradingForm;
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
      setShowTradingForm: (showTradingForm) =>
        dispatch({ type: SET_SHOW_TRADING_FORM, showTradingForm }),
      setSidebar: (sidebarType) => dispatch({ type: SET_SIDEBAR, sidebarType }),
      setIsMobile: (isMobile) => dispatch({ type: SET_IS_MOBILE, isMobile }),
      updateGraphData: (graphData) =>
        dispatch({ type: UPDATE_GRAPH_DATA, graphData }),
    },
  };
};
