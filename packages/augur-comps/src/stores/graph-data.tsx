import React from 'react';
import {
  DEFAULT_GRAPH_DATA_STATE,
  STUBBED_GRAPH_DATA_ACTIONS,
} from './constants';
import { useGraphData } from './graph-data-hooks';

export const GraphDataContext = React.createContext({
  ...DEFAULT_GRAPH_DATA_STATE,
  actions: STUBBED_GRAPH_DATA_ACTIONS,
});

export const GraphDataStore = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_GRAPH_DATA_STATE }),
  actions: STUBBED_GRAPH_DATA_ACTIONS,
};

export const GraphDataProvider = ({ children }) => {
  const state = useGraphData();

  if (!GraphDataStore.actionsSet) {
    GraphDataStore.actions = state.actions;
    GraphDataStore.actionsSet = true;
  }
  const readableState = { ...state };
  delete readableState.actions;
  GraphDataStore.get = () => readableState;

  return (
    <GraphDataContext.Provider value={state}>
      {children}
    </GraphDataContext.Provider>
  );
};

export const useGraphDataStore = () => React.useContext(GraphDataContext);

const output = {
  GraphDataProvider,
  useGraphDataStore,
  GraphDataStore
};

export default output;