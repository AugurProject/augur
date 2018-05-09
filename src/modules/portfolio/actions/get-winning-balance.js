import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import speedomatic from 'speedomatic'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'

export const getWinningBalance = (marketIds = [], callback = logError) => (dispatch, getState) => {
  const { loginAccount } = getState()
  augur.augurNode.submitRequest('getWinningBalance', { marketIds, account: loginAccount.address }, (err, winningBalance) => {
    if (err) return callback(err)

    const { marketsData } = getState()

    // clear out outstandingReturns
    marketIds.forEach((marketId) => {
      delete marketsData[marketId].outstandingReturns
    })

    const balances = winningBalance.filter(balance => balance.winnings !== '0')
    if (balances.length === 0) return callback(null, {})
    const updatedMarketsData = balances.reduce((p, balance) => ({
      ...p,
      [balance.marketId]: {
        ...marketsData[balance.marketId],
        outstandingReturns: speedomatic.unfix(balance.winnings, 'string'),
      },
    }), {})

    dispatch(updateMarketsData(updatedMarketsData))
    callback(null, updatedMarketsData)
  })
}
