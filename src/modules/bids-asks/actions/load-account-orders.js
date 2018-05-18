import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { forEach } from 'lodash'
import loadBidsAsks from 'modules/bids-asks/actions/load-bids-asks'
import { addOpenOrderTransactions } from 'modules/transactions/actions/add-transactions'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'

export const loadAccountOrders = (options = {}, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  augur.trading.getOrders({ ...options, creator: loginAccount.address, universe: universe.id }, (err, orders) => {
    if (err) return callback(err)
    if (orders == null || Object.keys(orders).length === 0) return callback(null)
    const marketIds = Object.keys(orders)
    dispatch(loadMarketsInfoIfNotLoaded(marketIds, (err) => {
      if (err) return callback(err)
      dispatch(addOpenOrderTransactions(orders))
      forEach(marketIds, id => dispatch(loadBidsAsks(id)))
      callback(null, orders)
    }))
  })
}
