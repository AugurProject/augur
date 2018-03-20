import { loadAccountPositions } from 'modules/my-positions/actions/load-account-positions'
import { updateOrders } from 'modules/my-orders/actions/update-orders'
import { CREATE_ORDER, CANCEL_ORDER, FILL_ORDER } from 'modules/transactions/constants/types'
import logError from 'utils/log-error'
import { loadAccountOrders } from '../../bids-asks/actions/load-account-orders'

export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA'
export const UPDATE_ACCOUNT_POSITIONS_DATA = 'UPDATE_ACCOUNT_POSITIONS_DATA'

export function updateAccountBidsAsksData(data, marketId, callback = logError) {
  return (dispatch) => {
    dispatch(updateOrders(data, true))
    dispatch(loadAccountPositions({ market: marketId }, callback))
  }
}

export function updateAccountTradesData(data, marketId, callback = logError) {
  return (dispatch) => {
    dispatch(updateOrders(data, true))
    dispatch(loadAccountPositions({ market: marketId }, callback))
  }
}

export function updateAccountCancelsData(data, marketId) {
  return (dispatch) => {
    dispatch(loadAccountOrders())
    dispatch(updateOrders(data, false))
  }
}

export function updateAccountPositionsData(data, marketId) {
  return { type: UPDATE_ACCOUNT_POSITIONS_DATA, data, marketId }
}

export function updateAccountTradeData(data, market) {
  return { type: UPDATE_ACCOUNT_TRADES_DATA, data, market }
}
