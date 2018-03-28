
import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import calculatePayoutNumeratorsValue from 'utils/calculate-payout-numerators-value'

export const getForkMigrationTotals = (universeId, callback = logError) => (dispatch, getState) => {
  const { marketsData, universe } = getState()

  augur.api.Universe.getForkingMarket({ tx: { to: universeId } }, (err, forkingMarketId) => {
    if (err) return callback(err)
    const forkingMarket = marketsData[forkingMarketId]
    augur.augurNode.submitRequest(
      'getForkMigrationTotals',
      {
        parentUniverse: universeId,
      }, (err, result) => {
        if (err) return callback(err)
        callback(Object.keys(result).reduce((acc, key) => {
          const cur = result[key]
          acc[calculatePayoutNumeratorsValue(forkingMarket, cur.payout, cur.isInvalid)] = {
            repTotal: cur.repTotal,
            winner: cur.universe === universe.winningChildUniverse,
          }
          return acc
        }, {}))
      },
    )
  })
}
