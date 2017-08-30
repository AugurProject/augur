import { augur } from 'services/augurjs'
import { updateAccountTradesData } from 'modules/my-positions/actions/update-account-trades-data'
import { clearAccountTrades } from 'modules/my-positions/actions/clear-account-trades'
import logError from 'utils/log-error'

export function loadAccountTrades(options, callback = logError) {
  return (dispatch, getState) => {
    const { branch, loginAccount } = getState()
    if (!loginAccount.address || !options) return callback(null)
    if (!options.market) dispatch(clearAccountTrades())
    const query = { ...options, account: loginAccount.address, universe: branch.id }
    augur.trading.getUserTradingHistory(query, (err, tradeHistory) => {
      if (err) return callback(err)
      dispatch(updateAccountTradesData(tradeHistory, options.market))
      callback(null)
    })
  }
}
