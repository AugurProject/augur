import async from 'async'
import { augur } from 'services/augurjs'
import { updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data'
import logError from 'utils/log-error'

export const loadAccountPositions = (options, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  if (!loginAccount.address) return callback(null)
  augur.trading.getUserTradingPositions({ ...options, account: loginAccount.address, universe: universe.id }, (err, shareBalances) => {
    if (err) return callback(err)
    if (shareBalances == null) return callback(null)
    async.forEachOfSeries(shareBalances, (position, index, next) => {
      dispatch(updateAccountPositionsData(position, position.marketID))
      return next()
    })
    callback(null, shareBalances)
  })
}
