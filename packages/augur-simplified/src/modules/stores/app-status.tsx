import React from 'react';
import { DEFAULT_APP_STATUS_STATE, STUBBED_APP_STATUS_ACTIONS } from '../stores/constants';
import { useAppStatus } from '../stores/app-status-hooks';
import { useUserStore } from '@augurproject/augur-comps';

export const AppStatusContext = React.createContext({
  ...DEFAULT_APP_STATUS_STATE,
  actions: STUBBED_APP_STATUS_ACTIONS,
});

export const AppStatusStore = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_APP_STATUS_STATE }),
  actions: STUBBED_APP_STATUS_ACTIONS,
};

export const AppStatusProvider = ({ children }) => {
  const state = useAppStatus();
  const {
    account
  } = useUserStore();
  if (!!account && !state.isLogged) {
    state.actions.setIsLogged(account);
  } else if (!account && state.isLogged) {
    state.actions.setIsLogged(account);
  }

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
