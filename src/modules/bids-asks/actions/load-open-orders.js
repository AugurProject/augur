import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { addOpenOrderTransactions } from 'modules/transactions/actions/add-transactions'
import { loadMarketsInfoOnly } from 'modules/markets/actions/load-markets-info'

export const loadOpenOrders = (options, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  augur.trading.getOpenOrders({ ...options, account: loginAccount.address, universe: universe.id }, (err, orders) => {
    if (err) return callback(err)
    if (orders == null || Object.keys(orders).length === 0) return callback(null)
    const marketIDs = Object.keys(orders)
    // TODO: consolidate all the getting of maket infos for load account history
    dispatch(loadMarketsInfoOnly(marketIDs.slice(), () => {
      dispatch(addOpenOrderTransactions(orders))
      // TODO update user's open orders
      callback(null, orders)
    }))
  })
}

