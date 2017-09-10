import async from 'async';
import { augur } from 'services/augurjs';
import { convertTradeLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions';
import { updateOrders } from 'modules/my-orders/actions/update-orders';
import { loadBidsAsksHistory } from 'modules/bids-asks/actions/load-bids-asks-history';
import { MAKE_ORDER, CANCEL_ORDER, TAKE_ORDER } from 'modules/transactions/constants/types';
import logError from 'utils/log-error';

export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA';
export const UPDATE_ACCOUNT_POSITIONS_DATA = 'UPDATE_ACCOUNT_POSITIONS_DATA';
export const UPDATE_COMPLETE_SETS_BOUGHT = 'UPDATE_COMPLETE_SETS_BOUGHT';
export const UPDATE_SMALLEST_POSITIONS = 'UPDATE_SMALLEST_POSITIONS';

export function updateSmallestPositions(marketID, smallestPosition) {
  return { type: UPDATE_SMALLEST_POSITIONS, marketID, smallestPosition };
}

export function updateAccountBidsAsksData(data, marketID, callback = logError) {
  return (dispatch, getState) => {
    const { loginAccount } = getState();
    dispatch(convertTradeLogsToTransactions(MAKE_ORDER, data, marketID));
    dispatch(updateOrders(data, true));
    augur.api.MarketFetcher.getPositionInMarket({ _account: loginAccount.address, _market: marketID }, (err, positionInMarket) => {
      if (err) return callback(err);
      dispatch(updateAccountPositionsData(positionInMarket, marketID));
      callback(null, positionInMarket);
    });
  };
}

export function updateAccountCancelsData(data, marketID) {
  return (dispatch, getState) => {
    dispatch(convertTradeLogsToTransactions(CANCEL_ORDER, data, marketID));
    dispatch(updateOrders(data, false));
  };
}

export function updateAccountTradesData(data, marketID, callback = logError) {
  return (dispatch, getState) => {
    dispatch(convertTradeLogsToTransactions(TAKE_ORDER, data, marketID));
    const { loginAccount } = getState();
    const account = loginAccount.address;
    async.eachSeries(data, (market, nextMarket) => {
      dispatch({ type: UPDATE_ACCOUNT_TRADES_DATA, market, data: data[market] });
      augur.api.MarketFetcher.getPositionInMarket({
        _account: account,
        _market: market
      }, (err, positionInMarket) => {
        if (err) return nextMarket(err);
        dispatch(updateAccountPositionsData(positionInMarket, market));
        dispatch(loadBidsAsksHistory({ market }));
        nextMarket(null);
      });
    }, callback);
  };
}

export function updateAccountPositionsData(data, marketID) {
  return { type: UPDATE_ACCOUNT_POSITIONS_DATA, data, marketID };
}

export function updateCompleteSetsBought(data, marketID) {
  return { type: UPDATE_COMPLETE_SETS_BOUGHT, data, marketID };
}
