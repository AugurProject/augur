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
  MODIFY_BETSLIP_AMOUNT: 'MODIFY_BETSLIP_AMOUNT',
  MODIFY_MYBETS_AMOUNT: 'MODIFY_MYBETS_AMOUNT',
};

function betslipAmountReducer(state, action) {
  const {
    INC_BETSLIP_AMOUNT,
    INC_MYBETS_AMOUNT,
    DEC_BETSLIP_AMOUNT,
    DEC_MYBETS_AMOUNT,
    CLEAR_BETSLIP_AMOUNT,
    MODIFY_BETSLIP_AMOUNT,
    MODIFY_MYBETS_AMOUNT,
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
    case MODIFY_BETSLIP_AMOUNT:
      return {
        ...state,
        betslipAmount: state.betslipAmount + action.amountChange,
      };
    case MODIFY_MYBETS_AMOUNT:
      return {
        ...state,
        myBetsAmount: state.myBetsAmount + action.amountChange,
      };
    default:
      throw new Error('invalid dispatch to betslipAmountReducer');
  }
}

const BETSLIP_ORDERS_ACTIONS = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  REMOVE_MARKET: 'REMOVE_MARKET',
  MODIFY: 'MODIFY',
  SEND: 'SEND',
  SEND_ALL: 'SEND_ALL',
  CLEAR_ALL: 'CLEAR_ALL',
};

const MY_BETS_ACTIONS = {
  ADD: 'ADD',
  ADD_MULTIPLE: 'ADD_MULTIPLE',
  CASH_OUT: 'CASH_OUT',
  UPDATE: 'UPDATE',
  RETRY: 'RETRY',
  TRASH: 'TRASH',
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

const MOCK_TEST_MY_BETS_STATE = [
  {
    '0x02': {
      description: 'DALLAS MAVERICKS vs HOUSTON ROCKETS, SPREAD',
      orders: [
        {
          outcome: 'Houston Rockets, -8.5',
          odds: '-110',
          wager: '30.00',
          toWin: '27.27',
          marketId: '0x02',
          amountFilled: '30.00',
          amountWon: '0',
          status: BET_STATUS.PENDING,
          dateUpdated: formatDate(now),
        },
      ],
    },
  },
  {
    '0x01': {
      description: 'CHICAGO BULLS vs BROOKLYN NETS, SPREAD',
      orders: [
        {
          outcome: 'Chicogo Bulls, +5',
          odds: '-105',
          wager: '20.00',
          toWin: '19.04',
          marketId: '0x01',
          amountFilled: '20.00',
          amountWon: '0',
          status: BET_STATUS.FILLED,
          dateUpdated: formatDate(now),
        },
        {
          outcome: 'Brooklyn Nets, -5',
          odds: '+115',
          wager: '100.00',
          toWin: '95.20',
          marketId: '0x01',
          amountFilled: '25.00',
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
          wager: '30.00',
          toWin: '27.27',
          marketId: '0x02',
          amountFilled: '30.00',
          amountWon: '0',
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
          wager: '50.00',
          toWin: '45.45',
          marketId: '0x03',
          amountFilled: '0',
          amountWon: '0',
          status: BET_STATUS.FAILED,
          dateUpdated: formatDate(now),
        },
      ],
    },
  },
];

function betslipOrdersReducer(state, action) {
  const {
    ADD,
    REMOVE,
    MODIFY,
    SEND,
    SEND_ALL,
    CLEAR_ALL,
    REMOVE_MARKET,
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
    case REMOVE_MARKET: {
      const { marketId } = action;
      const updatedState = { ...state };
      delete updatedState.orders[marketId];
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
  const { ADD, ADD_MULTIPLE, CASH_OUT, UPDATE, RETRY, TRASH } = MY_BETS_ACTIONS;
  switch (action.type) {
    case ADD: {
      const { subHeader, marketId, description, order } = action;
      const updatedState = { ...state };
      if (!updatedState[subHeader][marketId]) {
        updatedState[subHeader][marketId] = {
          description,
          orders: [],
        };
      }
      updatedState[subHeader][marketId].orders.push({
        ...order,
        amountFilled: order.wager,
        amountWon: '0',
        dateUpdated: formatDate(new Date()),
        status: BET_STATUS.PENDING,
      });
      return updatedState;
    }
    case ADD_MULTIPLE: {
      const { subHeader, marketId, description, orders } = action;
      const updatedState = { ...state };
      if (!updatedState[subHeader][marketId]) {
        updatedState[subHeader][marketId] = {
          description,
          orders: [],
        };
      }
      orders.forEach(order => {
        updatedState[subHeader][marketId].orders.push({
          ...order,
          amountFilled: order.wager,
          amountWon: '0',
          dateUpdated: formatDate(new Date()),
          status: BET_STATUS.PENDING,
        });
      });
      return updatedState;
    }
    case RETRY: {
      const { subHeader, marketId, orderId } = action;
      // TODO: send bet again but for now...
      const updatedState = { ...state };
      const order = updatedState[subHeader][marketId].orders[orderId];
      order.status = BET_STATUS.PENDING;
      order.amountFilled = order.wager;
      return updatedState;
    }
    case CASH_OUT: {
      const { subHeader, marketId, orderId } = action;
      const updatedState = { ...state };
      updatedState[subHeader][marketId].orders[orderId].isOpen = false;
      return updatedState;
    }
    case UPDATE: {
      const { subHeader, marketId, orderId, updates } = action;
      const updatedState = { ...state };
      updatedState[subHeader][marketId].orders[orderId] = {
        ...updatedState[subHeader][marketId].orders[orderId],
        ...updates,
        dateUpdated: formatDate(new Date()),
      };
      return updatedState;
    }
    case TRASH: {
      const { subHeader, marketId, orderId } = action;
      const updatedState = { ...state };
      updatedState[subHeader][marketId].orders.splice(orderId, 1);
      if (updatedState[subHeader][marketId].orders.length === 0) {
        delete updatedState[subHeader][marketId];
      }
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
    MODIFY_BETSLIP_AMOUNT,
    MODIFY_MYBETS_AMOUNT,
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
    modifyBetslipAmount: amountChange =>
      dispatch({ type: MODIFY_BETSLIP_AMOUNT, amountChange }),
    modifyMyBetsAmount: amountChange =>
      dispatch({ type: MODIFY_MYBETS_AMOUNT, amountChange }),
  };
};

export const useBetslip = (
  selected,
  ordersState = MOCK_TEST_BETSLIP_ORDER_STATE,
  myBetsState = MOCK_TEST_MY_BETS_STATE
) => {
  const [ordersInfo, ordersDispatch] = useReducer(
    betslipOrdersReducer,
    ordersState
  );
  const [myBets, myBetsDispatch] = useReducer(myBetsReducer, myBetsState);
  const { header, subHeader } = selected;
  let initialBetslipAmount = 0;
  let initialMyBetsAmount = 0;
  for (const market in ordersInfo.orders) {
    initialBetslipAmount += ordersInfo.orders[market].orders.length;
  }
  if (getTheme() === THEMES.BETTING) {
    for (const market in myBets[0]) {
      initialMyBetsAmount += myBets[0][market].orders.length;
    }
  }
  for (const market in myBets[1]) {
    initialMyBetsAmount += myBets[1][market].orders.length;
  }
  const betslipAmounts = useBetslipAmounts(header, {
    betslipAmount: initialBetslipAmount,
    myBetsAmount: initialMyBetsAmount,
  });
  const { ADD, REMOVE, MODIFY, CLEAR_ALL } = BETSLIP_ORDERS_ACTIONS;

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
      sendOrder: (marketId, orderId, description, order) => {
        ordersDispatch({ type: REMOVE, marketId, orderId });
        myBetsDispatch({
          type: MY_BETS_ACTIONS.ADD,
          subHeader,
          marketId,
          description,
          order,
        });
        betslipAmounts.incMyBetslipAmount();
        betslipAmounts.decBetslipAmount();
      },
      sendAllOrders: () => {
        const betslip = ordersInfo.orders;
        for (let [marketId, { description, orders }] of Object.entries(
          betslip
        )) {
          const ordersAmount = orders.length;
          myBetsDispatch({
            type: MY_BETS_ACTIONS.ADD_MULTIPLE,
            subHeader,
            marketId,
            description,
            orders,
          });
          betslipAmounts.clearBetslipAmount();
          ordersDispatch({ type: CLEAR_ALL });
          betslipAmounts.modifyMyBetsAmount(ordersAmount);
        }
      },
      cancelAllOrders: () => {
        ordersDispatch({ type: CLEAR_ALL });
        betslipAmounts.clearBetslipAmount();
      },
    },
    myBets,
    myBetsActions: {
      cashOutBet: (marketId, orderId) => {
        myBetsDispatch({
          type: MY_BETS_ACTIONS.CASH_OUT,
          subHeader,
          marketId,
          orderId,
        });
      },
      updateBet: (marketId, orderId, updates) => {
        myBetsDispatch({
          type: MY_BETS_ACTIONS.UPDATE,
          subHeader,
          marketId,
          orderId,
          updates,
        });
      },
      retryBet: (marketId, orderId) => {
        myBetsDispatch({
          type: MY_BETS_ACTIONS.RETRY,
          subHeader,
          marketId,
          orderId,
        });
      },
      trashBet: (marketId, orderId) => {
        myBetsDispatch({
          type: MY_BETS_ACTIONS.TRASH,
          subHeader,
          marketId,
          orderId,
        });
        betslipAmounts.decMyBetslipAmount();
      },
    },
    ...betslipAmounts,
  };
};
