import React from 'react';
import { DEFAULT_SIMPLIFIED_STATE, STUBBED_SIMPLIFIED_ACTIONS } from '../stores/constants';
import { useSimplified } from '../stores/simplified-hooks';

export const SimplifiedContext = React.createContext({
  ...DEFAULT_SIMPLIFIED_STATE,
  actions: STUBBED_SIMPLIFIED_ACTIONS,
});

export const SimplifiedStore = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_SIMPLIFIED_STATE }),
  actions: STUBBED_SIMPLIFIED_ACTIONS,
};

export const SimplifiedProvider = ({ children }) => {
  const state = useSimplified();
  

  if (!SimplifiedStore.actionsSet) {
    SimplifiedStore.actions = state.actions;
    SimplifiedStore.actionsSet = true;
  }
  const readableState = { ...state };
  delete readableState.actions;
  SimplifiedStore.get = () => readableState;

  return (
    <SimplifiedContext.Provider value={state}>
      {children}
    </SimplifiedContext.Provider>
  );
};

export const useSimplifiedStore = () => React.useContext(SimplifiedContext);
