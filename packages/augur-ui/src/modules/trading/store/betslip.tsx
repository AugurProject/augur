import React from 'react';
import { useBetslip } from 'modules/trading/hooks/betslip';

const BetslipContext = React.createContext({});

export const BetslipProvider = ({ children }) => {
  const state = useBetslip();

  return (
    <BetslipContext.Provider value={state}>
      {children}
    </BetslipContext.Provider>
  );
};

export const useBetslipStore = () => React.useContext(BetslipContext);