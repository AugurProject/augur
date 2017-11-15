import { augur } from 'services/augurjs'
import { updateAccountPositionsData } from 'modules/my-positions/actions/update-account-trades-data'
import { addPositionTransactions } from 'modules/transactions/actions/add-transactions'
import logError from 'utils/log-error'

export const loadAccountPositions = (options, callback = logError) => (dispatch, getState) => {
  const { universe, loginAccount } = getState()
  if (!loginAccount.address) return callback(null)
  augur.trading.getUserTradingPositions({ ...options, account: loginAccount.address, universe: universe.id }, (err, shareBalances) => {
    if (err) return callback(err)
    if (shareBalances == null) return callback(null)
    dispatch(addPositionTransactions(shareBalances))
    dispatch(updateAccountPositionsData(shareBalances, options.marketID))
    callback(null, shareBalances)
  })
}
