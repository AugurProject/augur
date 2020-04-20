import { useReducer } from 'react';
import { APP_STATUS_ACTIONS, DEFAULT_APP_STATUS, THEME, ODDS } from 'modules/app/store/constants';

const {
  SET_THEME,
  SET_ODDS,
} = APP_STATUS_ACTIONS;

export function AppStatusReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case (SET_THEME): {
      updatedState[THEME] = action.theme;
      return updatedState;
    }
    case (SET_ODDS): {
      updatedState[ODDS] = action.odds;
      return updatedState;
    }
    default:
      throw new Error(`Error: ${action.type} not caught by App Status reducer.`);
  }
};

export const useAppStatus = (defaultState = DEFAULT_APP_STATUS) => {
  const [state, dispatch] = useReducer(AppStatusReducer, defaultState);
  return {
    ...state,
    actions: {
      setTheme: theme => dispatch({ type: SET_THEME, theme }),
      setOdds: odds => dispatch({ type: SET_ODDS, odds }),
    }
  }
}