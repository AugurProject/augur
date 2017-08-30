import { augur } from 'services/augurjs'
import { updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data'
import logError from 'utils/log-error'

export const loadAccountPositions = (options, callback = logError) => (dispatch, getState) => {
  const { branch, loginAccount } = getState()
  if (!loginAccount.address) return callback(null)
  const query = { ...options, account: loginAccount.address, universe: branch.id }
  augur.trading.getUserTradingPositions(query, (err, shareBalances) => {
    if (err) return callback(err)
    if (shareBalances == null) return callback(`no account positions data received`)
    dispatch(updateAccountPositionsData(shareBalances, options.market))
    callback(null, shareBalances)
  })
}
