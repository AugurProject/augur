import { augur } from 'services/augurjs'
import { convertTradeLogsToTransactions } from 'modules/transactions/actions/convert-logs-to-transactions'
import { updateOrders } from 'modules/my-orders/actions/update-orders'
import { loadBidsAsksHistory } from 'modules/bids-asks/actions/load-bids-asks-history'
import { LOG_ADD_TX, LOG_CANCEL, LOG_FILL_TX } from 'modules/transactions/constants/types'

export const UPDATE_ACCOUNT_TRADES_DATA = 'UPDATE_ACCOUNT_TRADES_DATA'
export const UPDATE_ACCOUNT_POSITIONS_DATA = 'UPDATE_ACCOUNT_POSITIONS_DATA'
export const UPDATE_COMPLETE_SETS_BOUGHT = 'UPDATE_COMPLETE_SETS_BOUGHT'
export const UPDATE_NET_EFFECTIVE_TRADES_DATA = 'UPDATE_NET_EFFECTIVE_TRADES_DATA'
export const UPDATE_SELL_COMPLETE_SETS_LOCK = 'UPDATE_SELL_COMPLETE_SETS_LOCK'
export const UPDATE_SMALLEST_POSITIONS = 'UPDATE_SMALLEST_POSITIONS'
export const UPDATE_ORDERS_TRANSACTION_LOG = 'UPDATE_ORDERS_TRANSACTION_LOG'

export function updateSmallestPositions(marketID, smallestPosition) {
  return { type: UPDATE_SMALLEST_POSITIONS, marketID, smallestPosition }
}

export function updateSellCompleteSetsLock(marketID, isLocked) {
  return { type: UPDATE_SELL_COMPLETE_SETS_LOCK, marketID, isLocked }
}

export function updateAccountBidsAsksData(data, marketID) {
  return (dispatch, getState) => {
    dispatch(convertTradeLogsToTransactions(LOG_ADD_TX, data, marketID))
    dispatch(updateOrders(data, true))
    const { loginAccount } = getState()
    const account = loginAccount.address
    augur.trading.positions.getAdjustedPositions({ account, filter: { market: marketID } }, (err, positions) => {
      if (err) return console.error('getAdjustedPositions error: ', err)
      dispatch(updateAccountPositionsData(positions, marketID))
    })
  }
}

export function updateAccountCancelsData(data, marketID) {
  return (dispatch, getState) => {
    dispatch(convertTradeLogsToTransactions(LOG_CANCEL, data, marketID))
    dispatch(updateOrders(data, false))
  }
}

export function updateAccountTradesData(data, marketID) {
  return (dispatch, getState) => {
    dispatch(convertTradeLogsToTransactions(LOG_FILL_TX, data, marketID))
    const { loginAccount } = getState()
    const account = loginAccount.address
    Object.keys(data).forEach((market) => {
      augur.trading.positions.getAdjustedPositions({
        account,
        filter: { market }
      }, (err, positions) => {
        if (err) return console.error('getAdjustedPositions error: ', err)
        dispatch(updateAccountPositionsData(positions, market))
        dispatch(loadBidsAsksHistory({ market }))
      })
      dispatch({
        type: UPDATE_ACCOUNT_TRADES_DATA,
        market,
        data: data[market]
      })
    })
  }
}

export function updateAccountPositionsData(data, marketID) {
  return { type: UPDATE_ACCOUNT_POSITIONS_DATA, data, marketID }
}

export function updateNetEffectiveTradesData(data, marketID) {
  return { type: UPDATE_NET_EFFECTIVE_TRADES_DATA, data, marketID }
}

export function updateCompleteSetsBought(data, marketID) {
  return { type: UPDATE_COMPLETE_SETS_BOUGHT, data, marketID }
}
