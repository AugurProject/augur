import { useState, useReducer, createContext } from 'react';
import { getTheme } from 'modules/app/actions/update-app-status';
import { THEMES } from 'modules/common/constants';
import { formatDate } from 'utils/format-date';

const BETSLIP_AMOUNT_ACTIONS = {
  INC_BETSLIP_AMOUNT: 'INC_BETSLIP_AMOUNT',
  DEC_BETSLIP_AMOUNT: 'DEC_BETSLIP_AMOUNT',
  INC_MYBETS_AMOUNT: 'INC_MYBETS_AMOUNT',
  DEC_MYBETS_AMOUNT: 'DEC_MYBETS_AMOUNT',
  CLEAR_BETSLIP_AMOUNT: 'CLEAR_BETSLIP_AMOUNT',
};

function betslipAmountReducer(state, action) {
  const {
    INC_BETSLIP_AMOUNT,
    INC_MYBETS_AMOUNT,
    DEC_BETSLIP_AMOUNT,
    DEC_MYBETS_AMOUNT,
    CLEAR_BETSLIP_AMOUNT,
  } = BETSLIP_AMOUNT_ACTIONS;
  switch (action.type) {
    case INC_BETSLIP_AMOUNT:
      return { ...state, betslipAmount: state.betslipAmount + 1 };
    case DEC_BETSLIP_AMOUNT:
      return { ...state, betslipAmount: state.betslipAmount - 1 };
    case INC_MYBETS_AMOUNT:
      return { ...state, myBetsAmount: state.myBetsAmount + 1 };
    case DEC_MYBETS_AMOUNT:
      return { ...state, myBetsAmount: state.myBetsAmount - 1 };
    case CLEAR_BETSLIP_AMOUNT:
      return { ...state, betslipAmount: 0 };
    default:
      throw new Error('invalid dispatch to betslipAmountReducer');
  }
}

const BETSLIP_ORDERS_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  MODIFY: 'MODIFY',
  SEND: 'SEND',
  SEND_ALL: 'SEND_ALL',
  CLEAR_ALL: 'CLEAR_ALL',
};

const MY_BETS_ACTIONS = {
  ADD: 'ADD',
  CASH_OUT: 'CASH_OUT',
  UPDATE: 'UPDATE',
  RETRY: 'RETRY',
};

const BETSLIP_ORDER_DEFAULT_STATE = {
  bettingTextValues: {},
  confirmationDetails: {},
  orders: {},
};

const MOCK_TEST_BETSLIP_ORDER_STATE = {
  bettingTextValues: {
    betting: '30',
    potential: '28.18',
  },
  confirmationDetails: {
    wager: '30',
    fees: '1.50',
  },
  orders: {
    '0x01': {
      description: 'CHICAGO BULLS vs BROOKLYN NETS, SPREAD',
      orders: [
        {
          outcome: 'Chicogo Bulls, +5',
          odds: '-105',
          wager: '10.00',
          toWin: '9.52',
          marketId: '0x01',
        },
        {
          outcome: 'Brooklyn Nets, -5',
          odds: '+115',
          wager: '10.00',
          toWin: '19.52',
          marketId: '0x01',
        },
      ],
    },
    '0x02': {
      description: 'DALLAS MAVERICKS vs HOUSTON ROCKETS, SPREAD',
      orders: [
        {
          outcome: 'Houston Rockets, -8.5',
          odds: '-110',
          wager: '10.00',
          toWin: '9.09',
          marketId: '0x02',
        },
      ],
    },
  },
};

export const BET_STATUS = {
  PENDING: 'PENDING',
  FILLED: 'FILLED',
  PARTIALLY_FILLED: 'PARTIALLY_FILLED',
  CLOSED: 'CLOSED',
  FAILED: 'FAILED',
};

const now = new Date();

const MOCK_TEST_MY_BETS_STATE = {
  '0x01': {
    description: 'CHICAGO BULLS vs BROOKLYN NETS, SPREAD',
    orders: [
      {
        outcome: 'Chicogo Bulls, +5',
        odds: '-105',
        wager: '10.00',
        toWin: '9.52',
        marketId: '0x01',
        amountFilled: '10.00',
        amountWon: '0',
        status: BET_STATUS.FILLED,
        dateUpdated: formatDate(now),
      },
      {
        outcome: 'Brooklyn Nets, -5',
        odds: '+115',
        wager: '100.00',
        toWin: '19.52',
        marketId: '0x01',
        amountFilled: '10.00',
        amountWon: '0',
        status: BET_STATUS.PARTIALLY_FILLED,
        dateUpdated: formatDate(now),
      },
    ],
  },
  '0x02': {
    description: 'DALLAS MAVERICKS vs HOUSTON ROCKETS, SPREAD',
    orders: [
      {
        outcome: 'Houston Rockets, -8.5',
        odds: '-110',
        wager: '10.00',
        toWin: '9.09',
        marketId: '0x02',
        amountFilled: '10.00',
        amountWon: '9.09',
        status: BET_STATUS.PENDING,
        dateUpdated: formatDate(now),
      },
    ],
  },
  '0x03': {
    description: 'NEW YORK KNICKS vs UTAH JAZZ, SPREAD',
    orders: [
      {
        outcome: 'Utah Jazz, +10.5',
        odds: '-110',
        wager: '10.00',
        toWin: '9.09',
        marketId: '0x03',
        amountFilled: '0',
        amountWon: '0',
        status: BET_STATUS.FAILED,
        dateUpdated: formatDate(now),
      },
    ],
  },
};

function betslipOrdersReducer(state, action) {
  const {
    ADD,
    REMOVE,
    MODIFY,
    SEND,
    SEND_ALL,
    CLEAR_ALL,
  } = BETSLIP_ORDERS_ACTIONS;
  switch (action.type) {
    case ADD: {
      console.log(ADD, action.marketId, action.description, action.order);
      return state;
    }
    case REMOVE: {
      const { marketId, orderId } = action;
      const updatedState = { ...state };
      const market = updatedState.orders[marketId];
      market.orders.splice(orderId, 1);
      if (market.orders.length === 0) {
        delete updatedState.orders[marketId];
      }
      return updatedState;
    }
    case MODIFY: {
      const { marketId, orderId, order } = action;
      const updatedState = { ...state };
      updatedState.orders[marketId].orders[orderId] = order;
      return updatedState;
    }
    case SEND: {
      console.log(SEND, action.marketId, action.orderId);
      return state;
    }
    case SEND_ALL: {
      console.log(SEND_ALL);
      return state;
    }
    case CLEAR_ALL:
      return BETSLIP_ORDER_DEFAULT_STATE;
    default:
      throw new Error(
        `invalid dispatch to betslipOrdersReducer, ${action.type}`
      );
  }
}

function myBetsReducer(state, action) {
  const { ADD, CASH_OUT, UPDATE, RETRY } = MY_BETS_ACTIONS;
  switch (action.type) {
    case ADD: {
      console.log(ADD, action.marketId, action.description, action.order);
      return state;
    }
    case RETRY: {
      const { marketId, orderId } = action;
      // TODO: send bet again but for now...
      const updatedState = { ...state };
      updatedState[marketId].orders[orderId].status = BET_STATUS.PENDING;
      return updatedState;
    }
    case CASH_OUT: {
      const { marketId, orderId } = action;
      const updatedState = { ...state };
      updatedState[marketId].orders[orderId].isOpen = false;
      return updatedState;
    }
    case UPDATE: {
      const { marketId, orderId, updates } = action;
      const updatedState = { ...state};
      updatedState[marketId].orders[orderId] = {
        ...updatedState[marketId].orders[orderId],
        ...updates,
        dateUpdated: formatDate(new Date())
      };
      return updatedState;
    }
    default:
      throw new Error(`invalid dispatch to myBetsReducer, ${action.type}`);
  }
}

export const SelectedContext = createContext({ header: 0, subHeader: 0 });
export const BetslipStepContext = createContext(0);

export const useSelected = (defaultSelected = { header: 0, subHeader: 0 }) => {
  const [selected, setSelected] = useState(defaultSelected);
  const nextSelection = selected.header === 0 ? 1 : 0;
  const nextSubSelection = selected.subHeader === 0 ? 1 : 0;

  return {
    selected,
    toggleHeaderSelected: selectedClicked => {
      const isSports = getTheme() === THEMES.SPORTS;
      if (selectedClicked === nextSelection)
        setSelected({
          subHeader: isSports ? 1 : selected.subHeader,
          header: nextSelection,
        });
    },
    toggleSubHeaderSelected: selectedClicked => {
      const isSports = getTheme() === THEMES.SPORTS;
      if (selectedClicked === nextSubSelection)
        setSelected({
          ...selected,
          subHeader: isSports ? 1 : nextSubSelection,
        });
    },
  };
};

export const useBetslipAmounts = (
  selected: number,
  defaultState = { betslipAmount: 0, myBetsAmount: 0 }
) => {
  const [state, dispatch] = useReducer(betslipAmountReducer, defaultState);
  const isSelectedEmpty =
    selected === 0 ? state.betslipAmount === 0 : state.myBetsAmount === 0;
  const {
    INC_BETSLIP_AMOUNT,
    INC_MYBETS_AMOUNT,
    DEC_BETSLIP_AMOUNT,
    DEC_MYBETS_AMOUNT,
    CLEAR_BETSLIP_AMOUNT,
  } = BETSLIP_AMOUNT_ACTIONS;

  return {
    betslipAmount: state.betslipAmount,
    myBetsAmount: state.myBetsAmount,
    isSelectedEmpty,
    incBetslipAmount: () => dispatch({ type: INC_BETSLIP_AMOUNT }),
    incMyBetslipAmount: () => dispatch({ type: INC_MYBETS_AMOUNT }),
    decBetslipAmount: () => dispatch({ type: DEC_BETSLIP_AMOUNT }),
    decMyBetslipAmount: () => dispatch({ type: DEC_MYBETS_AMOUNT }),
    clearBetslipAmount: () => dispatch({ type: CLEAR_BETSLIP_AMOUNT }),
  };
};

export const useBetslip = (
  selected,
  ordersState = MOCK_TEST_BETSLIP_ORDER_STATE,
  myBetsState = MOCK_TEST_MY_BETS_STATE,
) => {
  const [ordersInfo, ordersDispatch] = useReducer(
    betslipOrdersReducer,
    ordersState
  );
  const [myBets, myBetsDispatch] = useReducer(myBetsReducer, myBetsState);
  let initialBetslipAmount = 0;
  let initialMyBetsAmount = 0;
  for (const market in ordersInfo.orders) {
    initialBetslipAmount += ordersInfo.orders[market].orders.length;
  }
  for (const market in myBets) {
    initialMyBetsAmount += myBets[market].orders.length;
  }
  const betslipAmounts = useBetslipAmounts(selected, {
    betslipAmount: initialBetslipAmount,
    myBetsAmount: initialMyBetsAmount,
  });
  const {
    ADD,
    REMOVE,
    MODIFY,
    SEND,
    SEND_ALL,
    CLEAR_ALL,
  } = BETSLIP_ORDERS_ACTIONS;

  return {
    ordersInfo,
    ordersActions: {
      addOrder: (marketId, description, order) => {
        ordersDispatch({ type: ADD, marketId, description, order });
        betslipAmounts.incBetslipAmount();
      },
      removeOrder: (marketId, orderId) => {
        ordersDispatch({ type: REMOVE, marketId, orderId });
        betslipAmounts.decBetslipAmount();
      },
      modifyOrder: (marketId, order) => {
        ordersDispatch({ type: MODIFY, marketId, order });
      },
      sendOrder: (marketId, orderId) => {
        ordersDispatch({ type: SEND, marketId, orderId });
      },
      sendAllOrders: () => {
        ordersDispatch({ type: SEND_ALL });
      },
      cancelAllOrders: () => {
        ordersDispatch({ type: CLEAR_ALL });
        betslipAmounts.clearBetslipAmount();
      },
    },
    myBets,
    myBetsActions: {
      addBet: (marketId, description, order) => {
        myBetsDispatch({ type: MY_BETS_ACTIONS.ADD, marketId, description, order });
        betslipAmounts.incMyBetslipAmount();
      },
      cashOutBet: (marketId, orderId) => {
        myBetsDispatch({ type: MY_BETS_ACTIONS.CASH_OUT, marketId, orderId });
      },
      updateBet: (marketId, orderId, updates) => {
        myBetsDispatch({ type: MY_BETS_ACTIONS.UPDATE, marketId, orderId, updates });
      },
      retryBet: (marketId, orderId) => {
        myBetsDispatch({ type: MY_BETS_ACTIONS.RETRY, marketId, orderId });
      },
    },
    ...betslipAmounts,
  };
};
