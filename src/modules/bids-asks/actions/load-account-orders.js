import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { addOpenOrderTransactions } from 'modules/transactions/actions/add-transactions'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { updateOrderBook } from 'modules/bids-asks/actions/update-order-book'

export const loadAccountOrders = (options, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  augur.trading.getOrders({ ...options, creator: loginAccount.address, universe: universe.id }, (err, orders) => {
    if (err) return callback(err)
    if (orders == null || Object.keys(orders).length === 0) return callback(null)
    const marketIDs = Object.keys(orders)
    // TODO: consolidate all the getting of maket infos for load account history
    dispatch(loadMarketsInfo(marketIDs, () => {
      dispatch(addOpenOrderTransactions(orders))
      marketIDs.forEach((marketID, id) => {
        const outcomes = Object.keys(orders[marketID])
        outcomes.forEach((outcome, id, nextOutcome) => {
          const orderTypeLabels = Object.keys(orders[marketID][outcome])
          orderTypeLabels.forEach(orderType => dispatch(updateOrderBook(marketID, outcome, orderType, orders[marketID][outcome][orderType])))
        })
      })
      callback(null, orders)
    }))
  })
}

