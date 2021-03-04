import React from 'react';
import {
  DEFAULT_MIGRATION_STATE,
  STUBBED_MIGRATION_ACTIONS,
} from '../stores/constants';
import { useMigration } from '../stores/migration-hooks';

export const MigrationContext = React.createContext({
  ...DEFAULT_MIGRATION_STATE,
  actions: STUBBED_MIGRATION_ACTIONS,
});

export const MigrationStore = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_MIGRATION_STATE }),
  actions: STUBBED_MIGRATION_ACTIONS,
};

export const MigrationProvider = ({ children }) => {
    const state = useMigration();
  
    if (!MigrationStore.actionsSet) {
        MigrationStore.actions = state.actions;
        MigrationStore.actionsSet = true;
    }
    const readableState = { ...state };
    delete readableState.actions;
    MigrationStore.get = () => readableState;
  
    return (
      <MigrationContext.Provider value={state}>
        {children}
      </MigrationContext.Provider>
    );
  };
  
  export const useMigrationStore = () => React.useContext(MigrationContext);
  