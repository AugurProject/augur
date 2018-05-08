import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import speedomatic from 'speedomatic'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'

export const loadUnclaimedFees = (marketIds = [], callback = logError) => (dispatch, getState) => {
  augur.augurNode.submitRequest('getUnclaimedMarketCreatorFees', { marketIds }, (err, marketsUnclaimedFees) => {
    if (err) return callback(err)

    const { marketsData } = getState()

    const updatedMarketsData = marketIds.reduce((p, market, index) => ({
      ...p,
      [market]: {
        ...marketsData[market],
        unclaimedCreatorFees: speedomatic.unfix(marketsUnclaimedFees[index].unclaimedFee, 'string'),
      },
    }), {})

    dispatch(updateMarketsData(updatedMarketsData))
    callback(null, marketsUnclaimedFees)
  })
}
