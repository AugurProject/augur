import { parallel } from 'async'
import { augur } from 'services/augurjs'
import { clearAccountTrades } from 'modules/my-positions/actions/clear-account-trades'
import { addTradeTransactions } from 'modules/transactions/actions/add-transactions'
import { loadAccountPositions } from 'modules/my-positions/actions/load-account-positions'
import { loadOpenOrders } from 'modules/bids-asks/actions/load-open-orders'
import logError from 'utils/log-error'

export function loadAccountTrades(options, callback = logError) {
  return (dispatch, getState) => {
    parallel([
      next => dispatch(loadUserTradingHistory(options, next)),
      next => dispatch(loadAccountPositions(options, next)),
      next => dispatch(loadOpenOrders(options, next))
    ], () => {
      callback(null)
    })
  }
}

export function loadUserTradingHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    if (!loginAccount.address || !options) return callback(null)
    const marketID = options.market
    if (!marketID) dispatch(clearAccountTrades())
    augur.trading.getUserTradingHistory({ ...options, account: loginAccount.address, universe: universe.id, marketID }, (err, userTradingHistory) => {
      if (err) return callback(err)
      if (userTradingHistory != null) {
        dispatch(addTradeTransactions(userTradingHistory))
        // TODO: update account trades, not sure why market is needed here
        /* dispatch({ type: UPDATE_ACCOUNT_TRADES_DATA, market, data: data[market] }) */
      }
      callback(null)
    })
  }
}
