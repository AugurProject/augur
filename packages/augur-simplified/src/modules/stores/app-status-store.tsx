import React from 'react';
import { DEFAULT_APP_STATUS_STATE, STUBBED_APP_STATUS_ACTIONS } from 'modules/stores/constants';
import { useAppStatus } from 'modules/stores/app-status-hooks';

export const AppStatusContext = React.createContext({
  ...DEFAULT_APP_STATUS_STATE,
  actions: STUBBED_APP_STATUS_ACTIONS,
});

export const AppStatusStore = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_APP_STATUS_STATE }),
  actions: STUBBED_APP_STATUS_ACTIONS,
};

export const AppProvider = ({ children }) => {
  const state = useAppStatus();

  if (!AppStatusStore.actionsSet) {
    AppStatusStore.actions = state.actions;
    AppStatusStore.actionsSet = true;
  }
  const readableState = { ...state };
  delete readableState.actions;
  AppStatusStore.get = () => readableState;

  return (
    <AppStatusContext.Provider value={state}>
      {children}
    </AppStatusContext.Provider>
  );
};

export const useAppStatusStore = () => React.useContext(AppStatusContext);
