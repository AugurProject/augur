import { useReducer } from 'react';
import {
  MIGRATION_ACTIONS,
  MOCK_MIGRATION_STATE,
  MIGRATION_KEYS,
} from './constants';
import { windowRef } from '@augurproject/augur-comps';
import { dispatchMiddleware } from './utils';
const {
  SET_TIMESTAMP
} = MIGRATION_ACTIONS;

const {
  TIMESTAMP
} = MIGRATION_KEYS;

export function MigrationReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case SET_TIMESTAMP: {
      updatedState[TIMESTAMP] = action.timestamp;
      break;
    }
    default:
      console.log(`Error: ${action.type} not caught by App Status reducer`);
  }
  windowRef.migration = updatedState;

  return updatedState;
}

export const useMigration = (defaultState = MOCK_MIGRATION_STATE) => {
  const [state, pureDispatch] = useReducer(MigrationReducer, defaultState);
  const dispatch = dispatchMiddleware(pureDispatch);
  windowRef.migration = state;
  return {
    ...state,
    actions: {
      setTimestamp: (timestamp) => dispatch({type: SET_TIMESTAMP, timestamp})
    },
  };
};
