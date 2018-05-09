import async from 'async'
import logError from 'utils/log-error'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'
import { collectMarketCreatorFees } from 'modules/portfolio/actions/collect-market-creator-fees'

export const loadUnclaimedFees = (marketIds = [], callback = logError) => (dispatch, getState) => {
  if (marketIds == null || marketIds.length === 0) return callback(null, [])
  const { marketsData } = getState()
  const unclaimedFees = {}
  async.eachSeries(marketIds, (marketId, nextMarket) => {
    dispatch(collectMarketCreatorFees(true, marketId, (err, balance) => {
      if (err) return nextMarket(err)
      unclaimedFees[marketId] = balance
      nextMarket()
    }))
  }, (err) => {
    // log error, but don't stop updating markets unclaimedFees
    if (err) console.error(err)
    const updatedMarketsData = marketIds.reduce((p, marketId, index) => ({
      ...p,
      [marketId]: {
        ...marketsData[marketId],
        unclaimedCreatorFees: unclaimedFees[marketId] || '0',
      },
    }), {})
    dispatch(updateMarketsData(updatedMarketsData))
    callback(null, updatedMarketsData)
  })
}
