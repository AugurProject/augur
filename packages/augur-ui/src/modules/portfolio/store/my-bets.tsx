import React from 'react';
import { useMyBets } from './my-bets-hooks';
import { DEFAULT_MY_BETS_STATE, STUBBED_MY_BETS_ACTIONS } from './constants';

const MyBetsContext = React.createContext({
  ...DEFAULT_MY_BETS_STATE,
  actions: STUBBED_MY_BETS_ACTIONS,
});

export const MyBets = {
  actionsSet: false,
  get: () => ({ ...DEFAULT_MY_BETS_STATE }),
  actions: STUBBED_MY_BETS_ACTIONS,
};

export const MyBetsProvider = ({ children }) => {
  const state = useMyBets();

  if (!MyBets.actionsSet) {
    MyBets.actions = state.actions;
    MyBets.actionsSet = true;
  }
  const readableState = { ...state };
  delete readableState.actions;
  MyBets.get = () => readableState;

  return (
    <MyBetsContext.Provider value={state}>
      {children}
    </MyBetsContext.Provider>
  );
};

export const useMyBetsStore = () => React.useContext(MyBetsContext);