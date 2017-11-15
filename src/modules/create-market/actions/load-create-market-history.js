import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { addMarketCreationTransactions } from 'modules/transactions/actions/add-transactions'

export function loadCreateMarketHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    if (!loginAccount.address) return callback(null)
    augur.markets.getMarketsCreatedByUser({ ...options, creator: loginAccount.address, universe: universe.id }, (err, marketsCreatedByUser) => {
      // note: marketsCreatedByUser is an array of market IDs
      if (err) return callback(err)
      if (marketsCreatedByUser == null) return callback(null)
      dispatch(addMarketCreationTransactions(marketsCreatedByUser))
      // TODO save markets created by user to state
      callback(null, marketsCreatedByUser)
    })
  }
}
