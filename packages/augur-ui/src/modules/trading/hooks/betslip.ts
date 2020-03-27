import { useReducer, createContext } from 'react';
import { formatDate } from 'utils/format-date';
import { createBigNumber } from 'utils/create-big-number';
import noop from 'utils/noop';

const now = new Date();

export const BET_STATUS = {
  UNSENT: 'UNSENT',
  UNFILLED: 'UNFILLED',
  PENDING: 'PENDING',
  FILLED: 'FILLED',
  PARTIALLY_FILLED: 'PARTIALLY_FILLED',
  CLOSED: 'CLOSED',
  FAILED: 'FAILED',
};

export const BETSLIP_SELECTED = {
  BETSLIP: 'betslip',
  MY_BETS: 'myBets',
  UNMATCHED: 'unmatched',
  MATCHED: 'matched',
};

const EMPTY_BETSLIST = {
  count: 0,
  items: {},
};

const DEFAULT_BETSLIP_STATE = {
  selected: {
    header: BETSLIP_SELECTED.BETSLIP,
    subHeader: BETSLIP_SELECTED.MATCHED,
  },
  step: 0,
  betslip: EMPTY_BETSLIST,
  unmatched: EMPTY_BETSLIST,
  matched: EMPTY_BETSLIST,
};

const MOCK_BETSLIP_STATE = {
  selected: {
    header: BETSLIP_SELECTED.BETSLIP,
    subHeader: BETSLIP_SELECTED.MATCHED,
  },
  step: 0,
  betslip: {
    count: 3,
    items: {
      '0x01': {
        description: 'CHICAGO BULLS vs BROOKLYN NETS, SPREAD',
        orders: [
          {
            outcome: 'Chicogo Bulls, +5',
            odds: '-105',
            wager: '10.00',
            toWin: '9.52',
            amountFilled: '0',
            amountWon: '0',
            status: BET_STATUS.UNSENT,
            dateUpdated: null,
          },
          {
            outcome: 'Brooklyn Nets, -5',
            odds: '+115',
            wager: '10.00',
            toWin: '19.52',
            amountFilled: '0',
            amountWon: '0',
            status: BET_STATUS.UNSENT,
            dateUpdated: null,
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
            amountFilled: '0',
            amountWon: '0',
            status: BET_STATUS.UNSENT,
            dateUpdated: null,
          },
        ],
      },
    },
  },
  unmatched: {
    count: 1,
    items: {
      '0x02': {
        description: 'DALLAS MAVERICKS vs HOUSTON ROCKETS, SPREAD',
        orders: [
          {
            outcome: 'Houston Rockets, -8.5',
            odds: '-110',
            wager: '10.00',
            toWin: '9.09',
            amountFilled: '0',
            amountWon: '0',
            status: BET_STATUS.UNFILLED,
            dateUpdated: formatDate(now),
          },
        ],
      },
    },
  },
  matched: {
    count: 4,
    items: {
      '0x01': {
        description: 'CHICAGO BULLS vs BROOKLYN NETS, SPREAD',
        orders: [
          {
            outcome: 'Chicogo Bulls, +5',
            odds: '-105',
            wager: '20.00',
            toWin: '19.04',
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
            amountFilled: '0',
            amountWon: '0',
            status: BET_STATUS.FAILED,
            dateUpdated: formatDate(now),
          },
        ],
      },
    },
  },
};

const BETSLIP_ACTIONS = {
  ADD_BET: 'ADD_BET',
  ADD_MATCHED: 'ADD_MATCHED',
  ADD_UNMATCHED: 'ADD_UNMATCHED',
  ADD_MULTIPLE_MATCHED: 'ADD_MULTIPLE_MATCHED',
  ADD_MULTIPLE_UNMATCHED: 'ADD_MULTIPLE_UNMATCHED',
  CASH_OUT: 'CASH_OUT',
  RETRY: 'RETRY',
  MODIFY_BET: 'MODIFY_BET',
  UPDATE_UNMATCHED: 'UPDATE_UNMATCHED',
  UPDATE_MATCHED: 'UPDATE_MATCHED',
  SEND_BET: 'SEND',
  SEND_ALL_BETS: 'SEND_ALL',
  TRASH: 'TRASH',
  CANCEL_BET: 'CANCEL_BET',
  CANCEL_UNMATCHED: 'CANCEL_UNMATCHED',
  CANCEL_ALL_BETS: 'CANCEL_ALL',
  CANCEL_ALL_UNMATCHED: 'CANCEL_ALL_UNMATCHED',
  TOGGLE_STEP: 'TOGGLE_STEP',
  TOGGLE_HEADER: 'TOGGLE_HEADER',
  TOGGLE_SUBHEADER: 'TOGGLE_SUBHEADER',
};

function BetslipReducer(state, action) {
  const {
    ADD_MATCHED,
    ADD_MULTIPLE_MATCHED,
    CASH_OUT,
    RETRY,
    MODIFY_BET,
    UPDATE_MATCHED,
    SEND_BET,
    SEND_ALL_BETS,
    TRASH,
    CANCEL_BET,
    CANCEL_ALL_BETS,
    CANCEL_ALL_UNMATCHED,
    TOGGLE_STEP,
    TOGGLE_HEADER,
    TOGGLE_SUBHEADER,
  } = BETSLIP_ACTIONS;
  const updatedState = { ...state };
  const betslipItems = updatedState.betslip.items;
  const matchedItems = updatedState.matched.items;
  const updatedTime = formatDate(new Date());
  switch (action.type) {
    case TOGGLE_HEADER: {
      const { BETSLIP, MY_BETS } = BETSLIP_SELECTED;
      const currentHeader = updatedState.selected.header;
      updatedState.selected.header =
        currentHeader === BETSLIP ? MY_BETS : BETSLIP;
      return updatedState;
    }
    case TOGGLE_SUBHEADER: {
      const { UNMATCHED, MATCHED } = BETSLIP_SELECTED;
      const currentSubHeader = updatedState.selected.subHeader;
      updatedState.selected.subHeader =
        currentSubHeader === UNMATCHED ? MATCHED : UNMATCHED;
      return updatedState;
    }
    case TOGGLE_STEP: {
      const currentStep = updatedState.step;
      updatedState.step = currentStep === 0 ? 1 : 0;
      return updatedState;
    }
    case SEND_BET: {
      // TODO: make this real, for now immediately to matched.
      const { marketId, description, orderId, order } = action;
      if (!matchedItems[marketId]) {
        matchedItems[marketId] = {
          description,
          orders: [],
        };
      }
      matchedItems[marketId].orders.push({
        ...order,
        amountFilled: order.wager,
        amountWon: '0',
        dateUpdated: updatedTime,
        status: BET_STATUS.PENDING,
      });
      const market = betslipItems[marketId];
      market.orders.splice(orderId, 1);
      if (market.orders.length === 0) {
        delete betslipItems[marketId];
      }
      updatedState.betslip.count--;
      updatedState.matched.count++;
      return updatedState;
    }
    case SEND_ALL_BETS: {
      for (let [marketId, { description, orders }] of Object.entries(
        betslipItems
      )) {
        const ordersAmount = orders.length;
        if (!matchedItems[marketId]) {
          matchedItems[marketId] = {
            description,
            orders: [],
          };
        }
        orders.forEach(order => {
          matchedItems[marketId].orders.push({
            ...order,
            amountFilled: order.wager,
            amountWon: '0',
            dateUpdated: updatedTime,
            status: BET_STATUS.PENDING,
          });
        });
        updatedState.matched.count += ordersAmount;
      }
      updatedState.betslip = EMPTY_BETSLIST;
      return updatedState;
    }
    case ADD_MATCHED: {
      const { fromList, marketId, description, order } = action;
      if (!matchedItems[marketId]) {
        matchedItems[marketId] = {
          description,
          orders: [],
        };
      }
      matchedItems[marketId].orders.push({
        ...order,
        amountFilled: order.wager,
        amountWon: '0',
        dateUpdated: updatedTime,
        status: BET_STATUS.PENDING,
      });
      updatedState.matched.count++;
      updatedState[fromList].count--;
      return updatedState;
    }
    case ADD_MULTIPLE_MATCHED: {
      const { fromList, marketId, description, orders } = action;
      if (!matchedItems[marketId]) {
        matchedItems[marketId] = {
          description,
          orders: [],
        };
      }
      orders.forEach(order => {
        matchedItems[marketId].orders.push({
          ...order,
          amountFilled: order.wager,
          amountWon: '0',
          dateUpdated: updatedTime,
          status: BET_STATUS.PENDING,
        });
      });
      updatedState.matched.count += orders.length;
      updatedState[fromList].count -= orders.length;
      return updatedState;
    }
    case RETRY: {
      const { marketId, orderId } = action;
      // TODO: send bet again but for now...
      const order = matchedItems[marketId].orders[orderId];
      order.status = BET_STATUS.PENDING;
      order.amountFilled = order.wager;
      return updatedState;
    }
    case CASH_OUT: {
      const { marketId, orderId } = action;
      // TODO: sell order, but for now...
      const cashedOutOrder = matchedItems[marketId].orders[orderId];
      cashedOutOrder.status = BET_STATUS.CLOSED;
      cashedOutOrder.amountWon = cashedOutOrder.toWin;
      return updatedState;
    }
    case UPDATE_MATCHED: {
      const { marketId, orderId, updates } = action;
      matchedItems[marketId].orders[orderId] = {
        ...matchedItems[marketId].orders[orderId],
        ...updates,
        dateUpdated: updatedTime,
      };
      return updatedState;
    }
    case TRASH: {
      const { marketId, orderId } = action;
      matchedItems[marketId].orders.splice(orderId, 1);
      if (matchedItems[marketId].orders.length === 0) {
        delete matchedItems[marketId];
      }
      updatedState.matched.count--;
      return updatedState;
    }
    case MODIFY_BET: {
      const { marketId, orderId, order } = action;
      betslipItems[marketId].orders[orderId] = order;
      return updatedState;
    }
    case CANCEL_BET: {
      const { marketId, orderId } = action;
      const market = betslipItems[marketId];
      market.orders.splice(orderId, 1);
      if (market.orders.length === 0) {
        delete betslipItems[marketId];
      }
      updatedState.betslip.count--;
      return updatedState;
    }
    case CANCEL_ALL_BETS: {
      updatedState.betslip = EMPTY_BETSLIST;
      return updatedState;
    }
    case CANCEL_ALL_UNMATCHED: {
      // TODO: make this cancel all open orders
      updatedState.unmatched = EMPTY_BETSLIST;
      return updatedState;
    }
    default:
      throw new Error(`Error: ${action.type} not caught by reducer`);
  }
}

export const SelectedContext = createContext({
  header: BETSLIP_SELECTED.BETSLIP,
  subHeader: BETSLIP_SELECTED.UNMATCHED,
});
export const BetslipStepContext = createContext(0);
export const BetslipActionsContext = createContext({
  toggleHeader: noop,
  toggleSubHeader: noop,
  toggleStep: noop,
  sendBet: noop,
  modifyBet: noop,
  cancelBet: noop,
  sendAllBets: noop,
  cancelAllBets: noop,
  retry: noop,
  cashOut: noop,
  updateMatched: noop,
  trash: noop,
  cancelAllUnmatched: noop,
  updateUnmatched: noop,
});

export const useBetslip = (defaultState = MOCK_BETSLIP_STATE) => {
  const [state, dispatch] = useReducer(BetslipReducer, defaultState);
  const {
    CASH_OUT,
    RETRY,
    MODIFY_BET,
    UPDATE_UNMATCHED,
    UPDATE_MATCHED,
    SEND_BET,
    SEND_ALL_BETS,
    TRASH,
    CANCEL_BET,
    CANCEL_ALL_BETS,
    CANCEL_ALL_UNMATCHED,
    TOGGLE_STEP,
    TOGGLE_HEADER,
    TOGGLE_SUBHEADER,
  } = BETSLIP_ACTIONS;
  return {
    ...state,
    actions: {
      toggleHeader: selected => {
        if (selected !== state.selected.header)
          dispatch({ type: TOGGLE_HEADER });
      },
      toggleSubHeader: selected => {
        if (selected !== state.selected.subHeader)
          dispatch({ type: TOGGLE_SUBHEADER });
      },
      toggleStep: () => dispatch({ type: TOGGLE_STEP }),
      sendBet: (marketId, orderId, description, order) => {
        dispatch({ type: SEND_BET, marketId, orderId, description, order });
      },
      modifyBet: (marketId, order) =>
        dispatch({ type: MODIFY_BET, marketId, order }),
      cancelBet: (marketId, order) =>
        dispatch({ type: CANCEL_BET, marketId, order }),
      sendAllBets: () => dispatch({ type: SEND_ALL_BETS }),
      cancelAllBets: () => dispatch({ type: CANCEL_ALL_BETS }),
      retry: (marketId, orderId) =>
        dispatch({ type: RETRY, marketId, orderId }),
      cashOut: (marketId, orderId) =>
        dispatch({ type: CASH_OUT, marketId, orderId }),
      updateMatched: (marketId, orderId, updates) =>
        dispatch({ type: UPDATE_MATCHED, marketId, orderId, updates }),
      trash: (marketId, orderId) =>
        dispatch({ type: TRASH, marketId, orderId }),
      cancelAllUnmatched: () => dispatch({ type: CANCEL_ALL_UNMATCHED }),
      updateUnmatched: (marketId, orderId, updates) =>
        console.log(`implement ${UPDATE_UNMATCHED} dispatch`),
    },
  };
};

export const calculateBetslipTotals = betslip => {
  let wager = createBigNumber(0);
  let potential = createBigNumber(0);
  let fees = createBigNumber(0);

  for (let [marketId, { orders }] of Object.entries(betslip.items)) {
    orders.forEach(order => {
      wager = wager.plus(order.wager);
      potential = potential.plus(order.toWin);
      // TODO: calculate this for real based on gas prices.
      fees = fees.plus(0.5);
    });
  }

  return {
    wager,
    potential,
    fees,
  };
};
