import React, { useEffect } from 'react';
import { DEFAULT_APP_STATUS, STUBBED_APP_STATUS_ACTIONS, THEME } from 'modules/app/store/constants';
import { useAppStatus } from 'modules/app/store/app-status-hooks';

const AppStatusContext = React.createContext({
  ...DEFAULT_APP_STATUS,
  actions: STUBBED_APP_STATUS_ACTIONS,
});

const setHTMLTheme = (theme) => document.documentElement.setAttribute(THEME, theme);

export const AppStatusProvider = ({ children }) => {
  const state = useAppStatus();
  const { theme } = state;
  useEffect(() => {
    setHTMLTheme(theme);
  }, [theme])

  return (
    <AppStatusContext.Provider value={state}>
      {children}
    </AppStatusContext.Provider>
  );
};

export const useAppStatusStore = () => React.useContext(AppStatusContext);