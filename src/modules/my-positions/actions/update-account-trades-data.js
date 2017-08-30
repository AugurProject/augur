import { eachSeries, parallel } from 'async'
import { loadAccountPositions } from 'modules/my-positions/actions/load-account-positions'
import { convertTradeLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'
import { updateOrders } from 'modules/my-orders/actions/update-orders'
import { loadBidsAsksHistory } from 'modules/bids-asks/actions/load-bids-asks-history'
import { CREATE_ORDER, CANCEL_ORDER, FILL_ORDER } from 'modules/transactions/constants/types'
import logError from 'utils/log-error'

export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA'
export const UPDATE_ACCOUNT_POSITIONS_DATA = 'UPDATE_ACCOUNT_POSITIONS_DATA'

export function updateAccountBidsAsksData(data, marketID, callback = logError) {
  return (dispatch) => {
    dispatch(convertTradeLogsToTransactions(CREATE_ORDER, data, marketID))
    dispatch(updateOrders(data, true))
    dispatch(loadAccountPositions({ market: marketID }, callback))
  }
}

export function updateAccountCancelsData(data, marketID) {
  return (dispatch) => {
    dispatch(convertTradeLogsToTransactions(CANCEL_ORDER, data, marketID))
    dispatch(updateOrders(data, false))
  }
}

export function updateAccountTradesData(data, marketID, callback = logError) {
  return (dispatch) => {
    dispatch(convertTradeLogsToTransactions(FILL_ORDER, data, marketID))
    eachSeries(data, (market, nextMarket) => {
      dispatch({ type: UPDATE_ACCOUNT_TRADES_DATA, market, data: data[market] })
      parallel([
        next => dispatch(loadAccountPositions({ market }, next)),
        next => dispatch(loadBidsAsksHistory({ market }, next))
      ], nextMarket)
    }, callback)
  }
}

export function updateAccountPositionsData(data, marketID) {
  return { type: UPDATE_ACCOUNT_POSITIONS_DATA, data, marketID }
}
