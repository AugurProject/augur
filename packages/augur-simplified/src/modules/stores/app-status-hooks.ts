import { useReducer } from 'react';
import {
  APP_STATUS_ACTIONS,
  MOCK_APP_STATUS_STATE,
  // DEFAULT_APP_STATUS_STATE,
} from 'modules/stores/constants';
import { windowRef } from 'utils/window-ref';

const {
  SET_IS_MOBILE,
  SET_FILTER_SIDEBAR
} = APP_STATUS_ACTIONS;

const isAsync = obj => {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    obj.constructor.name === 'AsyncFunction'
  );
};

const isPromise = obj => {
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
    action.payload.then(v => {
      dispatch({ ...action, payload: v });
    });
  } else {
    dispatch({ ...action });
  }
};

export const dispatchMiddleware = dispatch => action =>
  middleware(dispatch, action);

export const keyedObjToArray = (KeyedObject) => Object.entries(KeyedObject).map(i => i[1]);

export function AppStatusReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case SET_IS_MOBILE: {
      updatedState['isMobile'] = action.isMobile;
      break;
    }
    case SET_FILTER_SIDEBAR: {
      updatedState['filterSidebar'] = action.filterSidebar;
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
      setFilterSidebar: filterSidebar => dispatch({type: SET_FILTER_SIDEBAR, filterSidebar}),
      setIsMobile: isMobile => dispatch({ type: SET_IS_MOBILE, isMobile }),
    },
  };
};