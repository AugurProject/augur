import { useReducer } from 'react';
import { formatDate } from 'utils/format-date';
import { getNewToWin } from 'utils/get-odds';

import { ZERO } from 'modules/common/constants';
import {
  BET_STATUS,
  BETSLIP_SELECTED,
  EMPTY_BETSLIST,
  MOCK_BETSLIP_STATE,
  BETSLIP_ACTIONS,
} from 'modules/trading/store/constants';

const {
  CASH_OUT,
  RETRY,
  ADD_BET,
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
  ADD_MATCHED,
  ADD_MULTIPLE_MATCHED,
} = BETSLIP_ACTIONS;
const { BETSLIP, MY_BETS, MATCHED, UNMATCHED } = BETSLIP_SELECTED;
const { UNSENT, PENDING, CLOSED } = BET_STATUS;

export const calculateBetslipTotals = betslip => {
  let totalWager = ZERO;
  let potential = ZERO;
  let fees = ZERO;

  for (let [marketId, { orders }] of Object.entries(betslip.items)) {
    orders.forEach(({ wager, toWin }) => {
      totalWager = totalWager.plus(wager);
      potential = potential.plus(toWin);
      // TODO: calculate this for real based on gas prices.
      fees = fees.plus(0.5);
    });
  }

  return {
    wager: totalWager,
    potential,
    fees,
  };
};

export function BetslipReducer(state, action) {
  const updatedState = { ...state };
  const betslipItems = updatedState.betslip.items;
  const matchedItems = updatedState.matched.items;
  const updatedTime = formatDate(new Date());
  switch (action.type) {
    case TOGGLE_HEADER: {
      const currentHeader = updatedState.selected.header;
      updatedState.selected.header =
        currentHeader === BETSLIP ? MY_BETS : BETSLIP;
      return updatedState;
    }
    case TOGGLE_SUBHEADER: {
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
    case ADD_BET: {
      const { marketId, description, outcome, odds, wager } = action;
      if (!betslipItems[marketId]) {
        betslipItems[marketId] = {
          description,
          orders: []
        };
      }
      betslipItems[marketId].orders.push({
        outcome,
        odds,
        wager,
        toWin: '0',
        amountFilled: '0',
        amountWon: '0',
        status: UNSENT,
        dateUpdated: null,
      });
      updatedState.betslip.count++;
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
        status: PENDING,
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
            status: PENDING,
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
        status: PENDING,
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
          status: PENDING,
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
      order.status = PENDING;
      order.amountFilled = order.wager;
      return updatedState;
    }
    case CASH_OUT: {
      const { marketId, orderId } = action;
      // TODO: sell order, but for now...
      const cashedOutOrder = matchedItems[marketId].orders[orderId];
      cashedOutOrder.status = CLOSED;
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
      const toWin = getNewToWin(order.odds, order.wager);
      betslipItems[marketId].orders[orderId] = {...order, toWin };
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
      delete updatedState.betslip;
      updatedState.betslip = { count: 0, items: {} };
      return updatedState;
    }
    case CANCEL_ALL_UNMATCHED: {
      // TODO: make this cancel all open orders
      delete updatedState.unmatched;
      updatedState.unmatched = { count: 0, items: {} };
      return updatedState;
    }
    default:
      throw new Error(`Error: ${action.type} not caught by Betslip reducer`);
  }
}

export const useBetslip = (defaultState = MOCK_BETSLIP_STATE) => {
  const [state, dispatch] = useReducer(BetslipReducer, defaultState);
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
      addBet: (marketId, description, odds, outcome, wager = "0") => {
        dispatch({ type: ADD_BET, marketId, description, odds, outcome, wager });
      },
      sendBet: (marketId, orderId, description, order) => {
        dispatch({ type: SEND_BET, marketId, orderId, description, order });
      },
      modifyBet: (marketId, orderId, order) =>
        dispatch({ type: MODIFY_BET, marketId, orderId, order }),
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
