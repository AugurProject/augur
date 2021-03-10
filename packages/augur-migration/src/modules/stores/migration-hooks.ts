import { useReducer } from 'react';
import {
  MIGRATION_ACTIONS,
  MOCK_MIGRATION_STATE,
  MIGRATION_KEYS,
} from './constants';
import { windowRef, Stores } from '@augurproject/augur-comps';

const { dispatchMiddleware } = Stores.Utils;
const {
  SET_TIMESTAMP,
  UPDATE_APPROVAL,
  UPDATE_MIGRATED,
  UPDATE_TX_FAILED,
} = MIGRATION_ACTIONS;

const { TIMESTAMP, IS_APPROVED, IS_MIGRATED, TX_FAILED } = MIGRATION_KEYS;

export function MigrationReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case SET_TIMESTAMP: {
      updatedState[TIMESTAMP] = action.timestamp;
      break;
    }

    case UPDATE_APPROVAL: {
      updatedState[IS_APPROVED] = action.isApproved;
      break;
    }
    case UPDATE_MIGRATED: {
      updatedState[IS_MIGRATED] = action.isMigrated;
      break;
    }
    case UPDATE_TX_FAILED: {
      updatedState[TX_FAILED] = action.txFailed;
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
      updateTxFailed: (txFailed) =>
        dispatch({ type: UPDATE_TX_FAILED, txFailed }),
      updateMigrated: (isMigrated) =>
        dispatch({ type: UPDATE_MIGRATED, isMigrated }),
      updateApproval: (isApproved) =>
        dispatch({ type: UPDATE_APPROVAL, isApproved }),
      setTimestamp: (timestamp) => dispatch({ type: SET_TIMESTAMP, timestamp }),
    },
  };
};
