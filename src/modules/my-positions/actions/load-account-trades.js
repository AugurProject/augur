import { parallel } from 'async'
import { augur } from 'services/augurjs'
import { clearAccountTrades } from 'modules/my-positions/actions/clear-account-trades'
import { addTradeTransactions } from 'modules/transactions/actions/add-transactions'
import { loadAccountPositions } from 'modules/my-positions/actions/load-account-positions'
import { loadAccountOrders } from 'modules/bids-asks/actions/load-account-orders'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'
import { updateAccountTradeData } from 'modules/my-positions/actions/update-account-trades-data'
import logError from 'utils/log-error'

export function loadAccountTrades(options, callback = logError) {
  return (dispatch, getState) => {
    parallel([
      next => dispatch(loadUserTradingHistory(options, next)),
      next => dispatch(loadAccountPositions(options, next)),
      next => dispatch(loadAccountOrders(options, next)),
    ], () => {
      callback(null)
    })
  }
}

export function loadUserTradingHistory(options = {}, callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    if (loginAccount.address == null) return callback(null)
    if (options.marketId == null) dispatch(clearAccountTrades())
    augur.trading.getUserTradingHistory({ ...options, account: loginAccount.address, universe: universe.id }, (err, userTradingHistory) => {
      if (err) return callback(err)
      if (userTradingHistory == null || Object.keys(userTradingHistory).length === 0) return callback(null)
      const marketIds = Object.keys(userTradingHistory).reduce((p, index) => {
        const { marketId } = userTradingHistory[index]
        if (p.indexOf(marketId) === -1) p.push(marketId)
        return p
      }, [])
      dispatch(loadMarketsInfoIfNotLoaded(marketIds, (err) => {
        if (err) return callback(err)
        marketIds.forEach((marketId) => {
          const trades = {}
          userTradingHistory.filter(trade => trade.marketId === marketId).forEach((trade) => {
            if (trades[trade.outcome] == null) {
              trades[trade.outcome] = []
            }
            trades[trade.outcome] = [...trades[trade.outcome], trade]
          })
          dispatch(updateAccountTradeData(trades, marketId))
        })
        dispatch(addTradeTransactions(userTradingHistory))
        callback(null, userTradingHistory)
      }))
    })
  }
}
