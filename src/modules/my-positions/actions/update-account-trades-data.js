import { loadAccountPositions } from 'modules/my-positions/actions/load-account-positions'
import { convertTradeLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'
import { updateOrders } from 'modules/my-orders/actions/update-orders'
import { CREATE_ORDER, CANCEL_ORDER, FILL_ORDER } from 'modules/transactions/constants/types'
import logError from 'utils/log-error'
import { loadAccountOrders } from '../../bids-asks/actions/load-account-orders'

export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA'
export const UPDATE_ACCOUNT_POSITIONS_DATA = 'UPDATE_ACCOUNT_POSITIONS_DATA'

export function updateAccountBidsAsksData(data, marketID, callback = logError) {
  return (dispatch) => {
    dispatch(convertTradeLogsToTransactions(CREATE_ORDER, data, marketID))
    dispatch(updateOrders(data, true))
    dispatch(loadAccountPositions({ market: marketID }, callback))
  }
}

export function updateAccountTradesData(data, marketID, callback = logError) {
  return (dispatch) => {
    dispatch(convertTradeLogsToTransactions(FILL_ORDER, data, marketID))
    dispatch(updateOrders(data, true))
    dispatch(loadAccountPositions({ market: marketID }, callback))
  }
}

export function updateAccountCancelsData(data, marketID) {
  return (dispatch) => {
    dispatch(convertTradeLogsToTransactions(CANCEL_ORDER, data, marketID))
    dispatch(loadAccountOrders())
    dispatch(updateOrders(data, false))
  }
}

export function updateAccountPositionsData(data, marketID) {
  return { type: UPDATE_ACCOUNT_POSITIONS_DATA, data, marketID }
}

export function updateAccountTradeData(data, market) {
  return { type: UPDATE_ACCOUNT_TRADES_DATA, data, market }
}
