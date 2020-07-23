import { useReducer } from 'react';
import { formatDate } from 'utils/format-date';
import { convertToWin, getOddsObject, getWager } from 'utils/get-odds';

import { ZERO, ODDS_TYPE } from 'modules/common/constants';
import {
  BET_STATUS,
  BETSLIP_SELECTED,
  EMPTY_BETSLIST,
  MOCK_BETSLIP_STATE,
  BETSLIP_ACTIONS,
} from 'modules/trading/store/constants';
import { placeBet, simulateBetslipTrade, checkForDisablingPlaceBets } from 'utils/betslip-helpers';
import { AppStatus } from 'modules/app/store/app-status';
import { checkForUserInputFilled } from 'modules/common/validations';

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
  SET_DISABLE_PLACE_BETS,
  MODIFY_BET_ERROR_MESSAGE
} = BETSLIP_ACTIONS;
const { BETSLIP, MY_BETS, MATCHED, UNMATCHED } = BETSLIP_SELECTED;
const { UNSENT, PENDING, CLOSED, FILLED } = BET_STATUS;

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
  const {
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
  const updatedTime = currentAugurTimestamp;
  switch (action.type) {
    case TOGGLE_HEADER: {
      const currentHeader = updatedState.selected.header;
      updatedState.selected.header =
        currentHeader === BETSLIP ? MY_BETS : BETSLIP;
      break;
    }
    case TOGGLE_SUBHEADER: {
      const currentSubHeader = updatedState.selected.subHeader;
      updatedState.selected.subHeader =
        currentSubHeader === UNMATCHED ? MATCHED : UNMATCHED;
      break;
    }
    case TOGGLE_STEP: {
      const currentStep = updatedState.step;
      updatedState.step = currentStep === 0 ? 1 : 0;
      break;
    }
    case ADD_BET: {
      const {
        marketId,
        description,
        outcome,
        normalizedPrice,
        shares,
        outcomeId,
        price,
      } = action;
      updatedState.selected.header = BETSLIP;
      updatedState.step = 0;
      if (!betslipItems[marketId]) {
        betslipItems[marketId] = {
          description,
          orders: [],
        };
      } else {
        const matchingBet = betslipItems[marketId].orders.find(
          order =>
            order.outcomeId === outcomeId &&
            order.price === price &&
            order.shares === shares
        );
        if (matchingBet) {
          break;
        }
      }
      const wager = getWager(shares, price);
      let order = {
        outcome,
        normalizedPrice,
        wager,
        shares,
        outcomeId,
        price,
        toWin: convertToWin(normalizedPrice, shares),
        amountFilled: '0',
        amountWon: '0',
        status: UNSENT,
        dateUpdated: null,
        orderId: betslipItems[marketId].orders.length
      };
      simulateBetslipTrade(marketId, order, order.orderId);
      betslipItems[marketId].orders.push(order);
      updatedState.betslip.count++;
      break;
    }
    case SET_DISABLE_PLACE_BETS: {
      updatedState.placeBetsDisabled = action.placeBetsDisable;
      break;
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
      break;
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
          placeBet(marketId, order, matchedItems[marketId].orders.length);
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
      break;
    }
    case ADD_MATCHED: {
      const { fromList, marketId, description, order } = action;
      if (!matchedItems[marketId]) {
        matchedItems[marketId] = {
          description,
          orders: [],
        };
      }
      const match = matchedItems[marketId].orders.findIndex(
        lOrder =>
          lOrder.outcomeId === order.outcomeId && lOrder.price === order.price
      );
      if (match > -1) {
        matchedItems[marketId].orders[match] = {
          ...matchedItems[marketId].orders[match],
        };
      } else {
        matchedItems[marketId].orders.push({
          ...order,
          orderId: matchedItems[marketId].orders.length,
          amountFilled: order.wager,
          amountWon: '0',
        });
        updatedState.matched.count++;
        fromList && updatedState[fromList].count--;
      }
      break;
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
      break;
    }
    case RETRY: {
      const { marketId, orderId } = action;
      // TODO: send bet again but for now...
      const order = matchedItems[marketId].orders[orderId];
      order.status = PENDING;
      order.amountFilled = order.wager;
      placeBet(marketId, order, orderId);
      break;
    }
    case CASH_OUT: {
      const { marketId, orderId } = action;
      // TODO: sell order, but for now...
      const cashedOutOrder = matchedItems[marketId].orders[orderId];
      cashedOutOrder.status = CLOSED;
      cashedOutOrder.amountWon = cashedOutOrder.toWin;
      break;
    }
    case UPDATE_MATCHED: {
      const { marketId, orderId, updates } = action;
      matchedItems[marketId].orders[orderId] = {
        ...matchedItems[marketId].orders[orderId],
        ...updates,
        dateUpdated: updatedTime,
        timestampUpdated: Date.now() / 1000,
      };
      break;
    }
    case TRASH: {
      const { marketId, orderId } = action;
      matchedItems[marketId].orders.splice(orderId, 1);
      if (matchedItems[marketId].orders.length === 0) {
        delete matchedItems[marketId];
      }
      updatedState.matched.count--;
      break;
    }
    case MODIFY_BET: {
      const { marketId, orderId, order } = action;
      const toWin = convertToWin(
        order.normalizedPrice,
        order.shares
      );
      betslipItems[marketId].orders[orderId] = { ...order, toWin };
      updatedState.placeBetsDisabled = checkForDisablingPlaceBets(betslipItems);
      break;
    }
    case MODIFY_BET_ERROR_MESSAGE: {
      const { marketId, orderId, errorMessage } = action;
      betslipItems[marketId].orders[orderId] = { ...betslipItems[marketId].orders[orderId], errorMessage: errorMessage };
      updatedState.placeBetsDisabled = checkForDisablingPlaceBets(betslipItems);
      break;
    }
    case CANCEL_BET: {
      const { marketId, orderId } = action;
      const market = betslipItems[marketId];
      market.orders.splice(orderId, 1);
      if (market.orders.length === 0) {
        delete betslipItems[marketId];
      }
      updatedState.placeBetsDisabled = checkForDisablingPlaceBets(betslipItems);
      updatedState.betslip.count--;
      break;
    }
    case CANCEL_ALL_BETS: {
      delete updatedState.betslip;
      updatedState.betslip = { count: 0, items: {} };
      break;
    }
    case CANCEL_ALL_UNMATCHED: {
      // TODO: make this cancel all open orders
      delete updatedState.unmatched;
      updatedState.unmatched = { count: 0, items: {} };
      break;
    }
    default:
      throw new Error(`Error: ${action.type} not caught by Betslip reducer`);
  }
  window.betslip = updatedState;
  return updatedState;
}

export const useBetslip = (defaultState = MOCK_BETSLIP_STATE) => {
  const [state, dispatch] = useReducer(BetslipReducer, defaultState);
  window.betslip = state;
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
      setDisablePlaceBets: (placeBetsDisabled) => dispatch({ type: SET_DISABLE_PLACE_BETS, placeBetsDisabled }),
      toggleStep: () => dispatch({ type: TOGGLE_STEP }),
      addBet: (
        marketId,
        description,
        normalizedPrice,
        outcome,
        shares = '0',
        outcomeId,
        price = '0'
      ) =>
        dispatch({
          type: ADD_BET,
          marketId,
          description,
          normalizedPrice,
          outcome,
          shares,
          outcomeId,
          price,
        }),
      sendBet: (marketId, orderId, description, order) =>
        dispatch({ type: SEND_BET, marketId, orderId, description, order }),
      modifyBet: (marketId, orderId, order) =>
        dispatch({ type: MODIFY_BET, marketId, orderId, order }),
      modifyBetErrorMessage: (marketId, orderId, errorMessage) =>
        dispatch({ type: MODIFY_BET_ERROR_MESSAGE, marketId, orderId, errorMessage }),
      cancelBet: (marketId, orderId) =>
        dispatch({ type: CANCEL_BET, marketId, orderId }),
      sendAllBets: () => dispatch({ type: SEND_ALL_BETS }),
      cancelAllBets: () => dispatch({ type: CANCEL_ALL_BETS }),
      retry: (marketId, orderId) =>
        dispatch({ type: RETRY, marketId, orderId }),
      cashOut: (marketId, orderId) =>
        dispatch({ type: CASH_OUT, marketId, orderId }),
      updateMatched: (marketId, orderId, updates) =>
        dispatch({ type: UPDATE_MATCHED, marketId, orderId, updates }),
      addMatched: (fromList, marketId, description, order) =>
        dispatch({ type: ADD_MATCHED, fromList, marketId, description, order }),
      trash: (marketId, orderId) =>
        dispatch({ type: TRASH, marketId, orderId }),
      cancelAllUnmatched: () => dispatch({ type: CANCEL_ALL_UNMATCHED }),
      updateUnmatched: (marketId, orderId, updates) =>
        console.log(`implement ${UPDATE_UNMATCHED} dispatch`),
    },
  };
};
