import React, { useEffect } from 'react';
import {
  DEFAULT_SIMPLIFIED_STATE,
  STUBBED_SIMPLIFIED_ACTIONS,
  SIMPLIFIED_STATE_KEYS,
} from '../stores/constants';
import { useSimplified } from '../stores/simplified-hooks';
import { useUserStore, Stores } from '@augurproject/augur-comps';

const {
  Utils: { getSavedUserInfo },
} = Stores;

const { SETTINGS } = SIMPLIFIED_STATE_KEYS;

export const SimplifiedContext = React.createContext({
  ...DEFAULT_SIMPLIFIED_STATE,
  actions: STUBBED_SIMPLIFIED_ACTIONS,
});

export const SimplifiedStore = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_SIMPLIFIED_STATE }),
  actions: STUBBED_SIMPLIFIED_ACTIONS,
};

const useLoadUserSettings = () => {
  const { account } = useUserStore();
  useEffect(() => {
    if (account) {
      const savedUserSettings = getSavedUserInfo(account)[SETTINGS];
      if (savedUserSettings) {
        SimplifiedStore.actions.updateSettings(savedUserSettings);
      }
    } else {
      SimplifiedStore.actions.updateSettings(
        DEFAULT_SIMPLIFIED_STATE[SETTINGS]
      );
    }
  }, [account]);
};

export const SimplifiedProvider = ({ children }) => {
  const state = useSimplified();

  useLoadUserSettings();

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
