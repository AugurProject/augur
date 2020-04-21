import React from 'react';
import { useBetslip } from 'modules/trading/store/betslip-hooks';
import { DEFAULT_BETSLIP_STATE, STUBBED_BETSLIP_ACTIONS } from 'modules/trading/store/constants';

const BetslipContext = React.createContext({
  ...DEFAULT_BETSLIP_STATE,
  actions: STUBBED_BETSLIP_ACTIONS,
});

export const BetslipProvider = ({ children }) => {
  const state = useBetslip();

  return (
    <BetslipContext.Provider value={state}>
      {children}
    </BetslipContext.Provider>
  );
};

export const useBetslipStore = () => React.useContext(BetslipContext);