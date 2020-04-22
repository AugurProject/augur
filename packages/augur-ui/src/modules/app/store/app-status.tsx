import React, { createContext, useContext } from 'react';
import { DEFAULT_APP_STATUS, STUBBED_APP_STATUS_ACTIONS } from 'modules/app/store/constants';
import { useAppStatus } from 'modules/app/store/app-status-hooks';

const AppStatusContext = createContext({
  ...DEFAULT_APP_STATUS,
  actions: STUBBED_APP_STATUS_ACTIONS,
});

export const AppStatusProvider = ({ children }) => {
  const state = useAppStatus();

  return (
    <AppStatusContext.Provider value={state}>
      {children}
    </AppStatusContext.Provider>
  );
};

export const useAppStatusStore = () => useContext(AppStatusContext);
