import async from 'async'
import { augur } from 'services/augurjs'
import { updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data'
import logError from 'utils/log-error'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

export const loadAccountPositions = (options, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  if (!loginAccount.address) return callback(null)
  augur.trading.getUserTradingPositions({ ...options, account: loginAccount.address, universe: universe.id }, (err, shareBalances) => {
    if (err) return callback(err)
    if (shareBalances == null) return callback(null)
    // TODO: need better way to consolidate by marketID
    const marketIDs = shareBalances.reduce((collapsed, position) => {
      if (!collapsed[position.marketID]) {
        collapsed[position.marketID] = []
      }
      collapsed[position.marketID].push(position)
      return collapsed
    }, {})
    dispatch(loadMarketsInfo(Object.keys(marketIDs).slice(), () => {
      async.forEachOfSeries(marketIDs, (positions, id, nextID) => {
        dispatch(updateAccountPositionsData(marketIDs, id))
      })
      callback(null, shareBalances)
    }))
  })
}
