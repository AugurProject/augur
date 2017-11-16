import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { addMarketCreationTransactions } from 'modules/transactions/actions/add-transactions'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'

export function loadCreateMarketHistory(options, callback = logError) {
  return (dispatch, getState) => {
    const { universe, loginAccount } = getState()
    if (!loginAccount.address) return callback(null)
    augur.markets.getMarketsCreatedByUser({ ...options, creator: loginAccount.address, universe: universe.id }, (err, marketsCreatedByUser) => {
      // note: marketsCreatedByUser is an array of market IDs
      if (err) return callback(err)
      if ((marketsCreatedByUser == null) || (Array.isArray(marketsCreatedByUser) && marketsCreatedByUser.length === 0)) return callback(null)
      augur.markets.getMarketsInfo({ marketIDs: marketsCreatedByUser }, (err, marketsData) => {
        if (err) return callback(err)
        const marketInfoIDs = Object.keys(marketsData)
        if (!marketInfoIDs.length) return callback(null)
        dispatch(updateMarketsData(marketsData))
        dispatch(addMarketCreationTransactions(marketsCreatedByUser))
        // TODO save markets created by user to state
        callback(null, marketsCreatedByUser)
      })
    })
  }
}
