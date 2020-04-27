import React from 'react';
import { useMyBets } from './my-bets-hooks';
import { DEFAULT_MY_BETS_STATE, STUBBED_MY_BETS_ACTIONS } from './constants';

const MyBetsContext = React.createContext({
  ...DEFAULT_MY_BETS_STATE,
  actions: STUBBED_MY_BETS_ACTIONS,
});

export const MyBetsProvider = ({ children }) => {
  const state = useMyBets();

  return (
    <MyBetsContext.Provider value={state}>
      {children}
    </MyBetsContext.Provider>
  );
};

export const useMyBetsStore = () => React.useContext(MyBetsContext);