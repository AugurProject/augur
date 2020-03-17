import { useState, useReducer, createContext } from 'react';

export const BETSLIP_OPTIONS = {
  0: { label: 'Betslip', emptyHeader: `Betslip is empty` },
  1: { label: 'My Bets', emptyHeader: `You don't have any bets` },
};

const BETSLIP_ACTIONS = {
  INC_BETSLIP_AMOUNT: 'INC_BETSLIP_AMOUNT',
  DEC_BETSLIP_AMOUNT: 'DEC_BETSLIP_AMOUNT',
  INC_MYBETS_AMOUNT: 'INC_MYBETS_AMOUNT',
  DEC_MYBETS_AMOUNT: 'DEC_MYBETS_AMOUNT',
};

function betslipAmountReducer(state, action) {
  switch (action.type) {
    case BETSLIP_ACTIONS.INC_BETSLIP_AMOUNT:
      return { ...state, betslipAmount: state.betslipAmount + 1 };
    case BETSLIP_ACTIONS.DEC_BETSLIP_AMOUNT:
      return { ...state, betslipAmount: state.betslipAmount - 1 };
    case BETSLIP_ACTIONS.INC_MYBETS_AMOUNT:
      return { ...state, myBetsAmount: state.myBetsAmount + 1 };
    case BETSLIP_ACTIONS.DEC_MYBETS_AMOUNT:
      return { ...state, myBetsAmount: state.myBetsAmount - 1 };
    default:
      throw new Error('oops');
  }
}

export const SelectedContext = createContext(0);

export const useSelected = (defaultSelected = 0) => {
  const [selected, setSelected] = useState(defaultSelected);
  const nextSelection = selected === 0 ? 1 : 0;

  return {
    selected,
    ...BETSLIP_OPTIONS[selected],
    toggleSelected: currSelected => {
      if (currSelected !== nextSelection) setSelected(nextSelection);
    },
  };
};

export const useBetslipAmounts = (selected: number) => {
  const [state, dispatch] = useReducer(betslipAmountReducer, {
    betslipAmount: 0,
    myBetsAmount: 0,
  });
  const isSelectedEmpty =
    selected === 0 ? state.betslipAmount === 0 : state.myBetsAmount === 0;

  return {
    betslipAmount: state.betslipAmount,
    myBetsAmount: state.myBetsAmount,
    isSelectedEmpty,
    incBetslipAmount: () => dispatch({ type: BETSLIP_ACTIONS.INC_BETSLIP_AMOUNT }),
    incMyBetslipAmount: () => dispatch({ type: BETSLIP_ACTIONS.INC_MYBETS_AMOUNT }),
    decBetslipAmount: () => dispatch({ type: BETSLIP_ACTIONS.DEC_BETSLIP_AMOUNT }),
    decMyBetslipAmount: () => dispatch({ type: BETSLIP_ACTIONS.DEC_MYBETS_AMOUNT }),
  };
};
