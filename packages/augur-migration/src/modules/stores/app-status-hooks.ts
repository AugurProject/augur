import { useReducer } from 'react';
import {
  APP_STATUS_ACTIONS,
  MOCK_APP_STATUS_STATE,
  APP_STATE_KEYS,
} from './constants';
import { windowRef } from '@augurproject/augur-comps';
import { dispatchMiddleware, getSavedUserInfo } from './utils';
const {
  SET_IS_MOBILE,
  SET_MODAL,
  CLOSE_MODAL,
  SET_IS_LOGGED,
  SET_TIMESTAMP
} = APP_STATUS_ACTIONS;

const {
  IS_MOBILE,
  MODAL,
  IS_LOGGED,
  TIMESTAMP
} = APP_STATE_KEYS;

// const updateLocalStorage = (userAccount, updatedState) => {
//   const userData = JSON.parse(window.localStorage.getItem(userAccount)) || null;
//   if (userData) {
//     window.localStorage.setItem(
//       userAccount,
//       JSON.stringify({
//         ...userData,
//         settings: updatedState[SETTINGS],
//       })
//     );
//   } else if (!!userAccount) {
//     window.localStorage.setItem(
//       userAccount,
//       JSON.stringify({
//         account: userAccount,
//         settings: updatedState[SETTINGS],
//       })
//     );
//   }
// };


export function AppStatusReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case SET_IS_MOBILE: {
      updatedState[IS_MOBILE] = action[IS_MOBILE];
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
        // updatedState[SETTINGS] = {
        //   ...state[SETTINGS],
        //   ...getSavedUserInfo(account)[SETTINGS],
        // };
      }
      break;
    }
    case SET_TIMESTAMP: {
      updatedState[TIMESTAMP] = action.timestamp;
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
      setIsMobile: (isMobile) => dispatch({ type: SET_IS_MOBILE, isMobile }),
      setModal: (modal) => dispatch({ type: SET_MODAL, modal }),
      closeModal: () => dispatch({ type: CLOSE_MODAL }),
      setIsLogged: (account) => dispatch({ type: SET_IS_LOGGED, account }),
      setTimestamp: (timestamp) => dispatch({type: SET_TIMESTAMP, timestamp})
    },
  };
};
