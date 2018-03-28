
import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import calculatePayoutNumeratorsValue from 'utils/calculate-payout-numerators-value'

export const getForkMigrationTotals = (universe, callback = logError) => (dispatch, getState) => {
  const { marketsData } = getState()

  augur.api.Universe.getForkingMarket({ tx: { to: universe } }, (err, forkingMarketId) => {
    if (err) return callback(err)
    const forkingMarket = marketsData[forkingMarketId]
    augur.augurNode.submitRequest(
      'getForkMigrationTotals',
      {
        parentUniverse: universe,
      }, (err, result) => {
        if (err) return callback(err)
        callback(Object.keys(result).reduce((acc, key) => {
          const cur = result[key]
          acc[calculatePayoutNumeratorsValue(forkingMarket, cur.payout, cur.isInvalid)] = cur.repTotal
          return acc
        }, {}))
      },
    )
  })
}
