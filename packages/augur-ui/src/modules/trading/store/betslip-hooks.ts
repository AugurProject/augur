import { useReducer } from 'react';
import { convertToWin, getWager, getShares } from 'utils/get-odds';

import { ZERO } from 'modules/common/constants';
import {
  BET_STATUS,
  BETSLIP_SELECTED,
  EMPTY_BETSLIST,
  MOCK_BETSLIP_STATE,
  BETSLIP_ACTIONS,
  DEFAULT_BETSLIP_STATE,
} from 'modules/trading/store/constants';
import {
  placeBet,
  checkForDisablingPlaceBets,
  checkForConsumingOwnOrderError,
} from 'utils/betslip-helpers';
import { AppStatus } from 'modules/app/store/app-status';
import deepClone from 'utils/deep-clone';

const {
  CASH_OUT,
  RETRY,
  ADD_BET,
  MODIFY_BET,
  UPDATE_MATCHED,
  SEND_ALL_BETS,
  TRASH,
  CANCEL_BET,
  CANCEL_ALL_BETS,
  CANCEL_ALL_UNMATCHED,
  TOGGLE_STEP,
  TOGGLE_HEADER,
  TOGGLE_SUBHEADER,
  ADD_MATCHED,
  SET_DISABLE_PLACE_BETS,
  CLEAR_BETSLIP,
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
  let updatedState = { ...state };
  const betslipItems = updatedState.betslip.items;
  const matchedItems = updatedState.matched.items;
  const {
    blockchain: { currentAugurTimestamp },
  } = AppStatus.get();
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
        matchedId,
        description,
        min,
        max,
        outcome,
        normalizedPrice,
        shares,
        outcomeId,
        price,
      } = action;
      updatedState.selected.header = BETSLIP;
      updatedState.step = 0;
      if (!betslipItems[matchedId]) {
        betslipItems[matchedId] = {
          description,
          marketId,
          orders: [],
        };
      } else {
        const matchingBet = betslipItems[matchedId].orders.find(
          order => order.outcomeId === outcomeId && order.price === price
        );
        if (matchingBet) {
          break;
        }
      }
      let order = {
        outcome,
        normalizedPrice,
        wager: null,
        shares: null,
        outcomeId,
        price,
        max,
        min,
        toWin: null,
        amountFilled: '0',
        status: UNSENT,
        dateUpdated: null,
        orderId: betslipItems[matchedId].orders.length,
      };
      updatedState.placeBetsDisabled = true;

      betslipItems[matchedId].orders.push(order);
      updatedState.betslip.count++;
      break;
    }
    case SET_DISABLE_PLACE_BETS: {
      updatedState.placeBetsDisabled = action.placeBetsDisable;
      break;
    }
    case SEND_ALL_BETS: {
      for (let [matchedId, { marketId, description, orders }] of Object.entries(
        betslipItems
      )) {
        const ordersAmount = orders.length;
        if (!matchedItems[matchedId]) {
          matchedItems[matchedId] = {
            description,
            marketId, 
            orders: [],
          };
        }
        orders.forEach(order => {
          const orderId = matchedItems[matchedId].orders.length;
          matchedItems[matchedId].orders.push({
            ...order,
            orderId,
            amountFilled: order.wager,
            timestamp: currentAugurTimestamp,
            status: PENDING,
          });
          placeBet(marketId, matchedId, order, orderId);
        });
        updatedState.matched.count += ordersAmount;
      }
      updatedState.betslip = deepClone(EMPTY_BETSLIST);
      break;
    }
    case ADD_MATCHED: {
      const { fromList, marketId, sportsBook, description, order } = action;
      //const matchedId = sportsBook.groupId;
      const matchedId = marketId;
      if (!matchedItems[matchedId]) {
        matchedItems[matchedId] = {
          description,
          sportsBook,
          marketId,
          orders: [],
        };
      }
      const match = matchedItems[matchedId].orders.findIndex(
        lOrder => lOrder.outcomeId === order.outcomeId
      );
      if (match > -1) {
        matchedItems[matchedId].orders[match] = {
          ...matchedItems[matchedId].orders[match],
          ...order,
        };
      } else {
        matchedItems[matchedId].orders.push({
          ...order,
          orderId: matchedItems[marketId].orders.length,
          amountFilled: order.wager,
        });
        updatedState.matched.count++;
        fromList && updatedState[fromList].count--;
      }
      break;
    }
    case RETRY: {
      const { marketId, matchedId, orderId } = action;
      // TODO: send bet again but for now...
      const order = matchedItems[matchedId].orders[orderId];
      order.status = PENDING;
      order.amountFilled = order.wager;
      placeBet(marketId, matchedId, order, orderId);
      break;
    }
    case CASH_OUT: {
      const { marketId, matchedId, orderId } = action;
      // TODO: sell order, but for now...
      const cashedOutOrder = matchedItems[matchedId].orders[orderId];
      cashedOutOrder.status = CLOSED;
      break;
    }
    case UPDATE_MATCHED: {
      const { marketId, matchedId, orderId, updates } = action;
      if (matchedItems[matchedId]) {
        matchedItems[matchedId].orders[orderId] = {
          ...matchedItems[matchedId].orders[orderId],
          ...updates,
          orderId,
          dateUpdated: currentAugurTimestamp,
          timestampUpdated: Date.now() / 1000,
        };
      }
      break;
    }
    case TRASH: {
      const { marketId, matchedId, orderId } = action;
      matchedItems[matchedId].orders.splice(orderId, 1);
      if (matchedItems[matchedId].orders.length === 0) {
        delete matchedItems[matchedId];
      }
      updatedState.matched.count--;
      break;
    }
    case MODIFY_BET: {
      const { marketId, matchedId, orderId, order } = action;
      const shares = getShares(order.wager, order.price);
      const toWin = convertToWin(order.max, shares);
      const prevWager = betslipItems[matchedId].orders[orderId].wager;
      if (betslipItems[matchedId]?.orders)
        betslipItems[matchedId].orders[orderId] = { ...order, marketId, orderId, shares, toWin };
      if (prevWager !== order.wager) {
        checkForConsumingOwnOrderError(
          marketId,
          matchedId,
          { ...order, shares: shares },
          orderId
        );
      }
      updatedState.placeBetsDisabled = checkForDisablingPlaceBets(betslipItems);
      break;
    }
    case CANCEL_BET: {
      const { marketId, matchedId, orderId } = action;
      const market = betslipItems[matchedId];
      market.orders.splice(orderId, 1);
      if (market.orders.length === 0) {
        delete betslipItems[matchedId];
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
    case CLEAR_BETSLIP: {
      updatedState = deepClone(DEFAULT_BETSLIP_STATE);
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
  window.stores.betslip = updatedState;
  return updatedState;
}

export const useBetslip = (defaultState = MOCK_BETSLIP_STATE) => {
  const [state, dispatch] = useReducer(BetslipReducer, defaultState);
  window.betslip = state;
  window.stores.betslip = state;
  return {
    ...state,
    actions: {
      clearBetslip: () => dispatch({ type: CLEAR_BETSLIP }),
      toggleHeader: selected => {
        if (selected !== state.selected.header)
          dispatch({ type: TOGGLE_HEADER });
      },
      toggleSubHeader: selected => {
        if (selected !== state.selected.subHeader)
          dispatch({ type: TOGGLE_SUBHEADER });
      },
      setDisablePlaceBets: placeBetsDisabled =>
        dispatch({ type: SET_DISABLE_PLACE_BETS, placeBetsDisabled }),
      toggleStep: () => dispatch({ type: TOGGLE_STEP }),
      addBet: (
        marketId,
        matchedId,
        description,
        max,
        min,
        normalizedPrice,
        outcome,
        shares = '0',
        outcomeId,
        price = '0'
      ) =>
        dispatch({
          type: ADD_BET,
          marketId,
          matchedId,
          description,
          max,
          min,
          normalizedPrice,
          outcome,
          shares,
          outcomeId,
          price,
        }),
      modifyBet: (marketId, matchedId, orderId, order) =>
        dispatch({ type: MODIFY_BET, marketId, matchedId, orderId, order }),
      cancelBet: (marketId, matchedId, orderId) =>
        dispatch({ type: CANCEL_BET, marketId, matchedId, orderId }),
      sendAllBets: () => dispatch({ type: SEND_ALL_BETS }),
      cancelAllBets: () => dispatch({ type: CANCEL_ALL_BETS }),
      retry: (marketId, matchedId, orderId) =>
        dispatch({ type: RETRY, marketId, matchedId, orderId }),
      cashOut: (marketId, matchedId, orderId) =>
        dispatch({ type: CASH_OUT, marketId, matchedId, orderId }),
      updateMatched: (marketId, matchedId, orderId, updates) =>
        dispatch({ type: UPDATE_MATCHED, marketId, matchedId, orderId, updates }),
      addMatched: (fromList, marketId, matchedId, sportsBook, description, order) =>
        dispatch({ type: ADD_MATCHED, fromList, marketId, matchedId, sportsBook, description, order }),
      trash: (marketId, matchedId, orderId) =>
        dispatch({ type: TRASH, marketId, matchedId, orderId }),
      cancelAllUnmatched: () => dispatch({ type: CANCEL_ALL_UNMATCHED }),
    },
  };
};
