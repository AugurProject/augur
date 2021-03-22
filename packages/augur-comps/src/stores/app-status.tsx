import React, { useEffect } from 'react';
import { DEFAULT_APP_STATUS_STATE, STUBBED_APP_STATUS_ACTIONS } from './constants';
import { useAppStatus } from './app-status-hooks';
import { useUserStore } from './user';
import { windowRef } from '../utils/window-ref';

function checkIsMobile(setIsMobile) {
  const isMobile =
    (
      windowRef.getComputedStyle(document.body).getPropertyValue('--is-mobile') ||
      ''
    ).indexOf('true') !== -1;
  setIsMobile(isMobile);
}

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

  useEffect(() => {
    const handleResize = () => checkIsMobile(state.actions.setIsMobile);
    windowRef.addEventListener('resize', handleResize);
    handleResize();
    return () => {
      windowRef.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <AppStatusContext.Provider value={state}>
      {children}
    </AppStatusContext.Provider>
  );
};

export const useAppStatusStore = () => React.useContext(AppStatusContext);

const output = {
  AppStatusProvider,
  useAppStatusStore,
  AppStatusStore
};

export default output;