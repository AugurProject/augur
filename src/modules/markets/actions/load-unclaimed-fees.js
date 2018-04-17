import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'

export const loadUnclaimedFees = (marketIds = [], callback = logError) => (dispatch, getState) => {
  augur.augurNode.submitRequest('getUnclaimedMarketCreatorFees', { marketIds }, (err, marketsUnclaimedFees) => {
    if (err) return callback(err)

    const { marketsData } = getState()

    const updatedMarketsData = marketIds.reduce((p, market, value) => ({
      ...p,
      [market]: {
        ...marketsData[market],
        unclaimedCreatorFees: marketsUnclaimedFees[market],
      },
    }), {})

    dispatch(updateMarketsData(updatedMarketsData))
    callback(null, marketsUnclaimedFees)
  })
}
