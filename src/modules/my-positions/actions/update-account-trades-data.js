import { convertTradeLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import { loadAdjustedPositionsForMarket } from 'modules/my-positions/actions/load-adjusted-positions-for-market';
import { addOrder, removeOrder } from 'modules/bids-asks/actions/update-market-order-book';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';

import { augur } from 'services/augurjs';

import { CANCEL_ORDER } from 'modules/transactions/constants/types';

export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA';
export const UPDATE_ACCOUNT_POSITIONS_DATA = 'UPDATE_ACCOUNT_POSITIONS_DATA';
export const UPDATE_COMPLETE_SETS_BOUGHT = 'UPDATE_COMPLETE_SETS_BOUGHT';
export const UPDATE_NET_EFFECTIVE_TRADES_DATA = 'UPDATE_NET_EFFECTIVE_TRADES_DATA';
export const UPDATE_SELL_COMPLETE_SETS_LOCK = 'UPDATE_SELL_COMPLETE_SETS_LOCK';
export const UPDATE_SMALLEST_POSITIONS = 'UPDATE_SMALLEST_POSITIONS';
export const UPDATE_ORDERS_TRANSACTION_LOG = 'UPDATE_ORDERS_TRANSACTION_LOG';

export function updateSmallestPositions(marketID, smallestPosition) {
  return { type: UPDATE_SMALLEST_POSITIONS, marketID, smallestPosition };
}

export function updateSellCompleteSetsLock(marketID, isLocked) {
  return { type: UPDATE_SELL_COMPLETE_SETS_LOCK, marketID, isLocked };
}

export function updateAccountBidsAsksData(data, marketID) {
  return (dispatch, getState) => {
    dispatch(convertTradeLogsToTransactions('log_add_tx', data, marketID));
    dispatch(updateOrders(data, true));
  };
}

export function updateAccountCancelsData(data, marketID) {
  return (dispatch, getState) => {
    dispatch(convertTradeLogsToTransactions('log_cancel', data, marketID));
    dispatch(updateOrders(data, false));
  };
}

export function updateAccountTradesData(data, marketID) {
  return (dispatch, getState) => {
    dispatch(convertTradeLogsToTransactions('log_fill_tx', data, marketID));
    const { loginAccount } = getState();
    const account = loginAccount.address;
    Object.keys(data).forEach((market) => {
      augur.getAdjustedPositions(account, { market }, (err, positions) => {
        if (err) return console.error('getAdjustedPositions error: ', err);
        dispatch(updateAccountPositionsData(positions, market));
      });
      dispatch({
        type: UPDATE_ACCOUNT_TRADES_DATA,
        market,
        data: data[market]
      });
    });
  };
}

export function updateAccountPositionsData(data, marketID) {
  return { type: UPDATE_ACCOUNT_POSITIONS_DATA, data, marketID };
}

export function updateNetEffectiveTradesData(data, marketID) {
  return { type: UPDATE_NET_EFFECTIVE_TRADES_DATA, data, marketID };
}

export function updateCompleteSetsBought(data, marketID) {
  return { type: UPDATE_COMPLETE_SETS_BOUGHT, data, marketID };
}

export function updateOrders(data, isAddition) {
  return (dispatch, getState) => {
    Object.keys(data).forEach((market) => {
      const isMarketInfoLoaded = getState().marketsData[market];

      if (isMarketInfoLoaded) {
        dispatchOrderUpdates(data[market], false, dispatch);
      } else {
        dispatch(loadMarketsInfo([market], () => {
          dispatchOrderUpdates(data[market], false, dispatch);
        }));
      }
    });

    function dispatchOrderUpdates(marketOrderData) {
      Object.keys(marketOrderData).forEach((outcome) => {
        marketOrderData[outcome].forEach((orderLog) => {
          const transactionsData = getState().transactionsData;
          const cancelledOrder = Object.keys(transactionsData).find(id => transactionsData[id].tradeID === orderLog.tradeid && transactionsData[id].type === CANCEL_ORDER);

          if (isAddition && !cancelledOrder) {
            dispatch(addOrder(orderLog));
          } else {
            dispatch(removeOrder(orderLog));
          }
        });
      });
    }
  };
}
