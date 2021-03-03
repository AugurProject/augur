import { dispatchMiddleware } from './utils';
import { useReducer } from 'react';
import { windowRef } from '../utils/window-ref';
import {
  GRAPH_DATA_ACTIONS,
  GRAPH_DATA_KEYS,
  DEFAULT_GRAPH_DATA_STATE,
} from './constants';

const { UPDATE_GRAPH_HEARTBEAT } = GRAPH_DATA_ACTIONS;
const { AMM_EXCHANGES, BLOCKNUMBER, CASHES, ERRORS, MARKETS } = GRAPH_DATA_KEYS;

export function GraphDataReducer(state, action) {
  const updatedState = { ...state };
  switch (action.type) {
    case UPDATE_GRAPH_HEARTBEAT: {
      const { markets, cashes, ammExchanges, errors, blocknumber } = action;
      updatedState[MARKETS] = markets;
      updatedState[CASHES] = cashes;
      updatedState[AMM_EXCHANGES] = ammExchanges;
      updatedState[ERRORS] = errors || null;
      updatedState[BLOCKNUMBER] = blocknumber;
      break;
    }
    default:
      console.log(`Error: ${action.type} not caught by Graph Data reducer`);
  }
  windowRef.graphData = updatedState;
  return updatedState;
}

export const useGraphData = (defaultState = DEFAULT_GRAPH_DATA_STATE) => {
  const [state, pureDispatch] = useReducer(GraphDataReducer, defaultState);
  const dispatch = dispatchMiddleware(pureDispatch);
  windowRef.graphData = state;

  return {
    ...state,
    actions: {
      updateGraphHeartbeat: (
        { markets, cashes, ammExchanges },
        blocknumber,
        errors
      ) =>
        dispatch({
          type: UPDATE_GRAPH_HEARTBEAT,
          ammExchanges,
          blocknumber,
          cashes,
          errors,
          markets,
        }),
    },
  };
};
