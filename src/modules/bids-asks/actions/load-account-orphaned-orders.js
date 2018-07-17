import { augur } from 'services/augurjs'
import logError from 'utils/log-error'

export const loadAccountOrphanedOrders = (options = {}, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()

  augur.trading.getOrders({ ...options, orphaned: true, creator: loginAccount.address, universe: universe.id }, (err, orders) => {
    if (err) return callback(err)
    if (orders == null || Object.keys(orders).length === 0) return callback(null)
    const marketIds = Object.keys(orders)
    console.log(marketIds)

    callback(null, orders)
  })
}
