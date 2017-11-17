import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'

const loadMarkets = (callback = logError) => (dispatch, getState) => {
  const { universe } = getState()
  augur.augurNode.submitRequest('getMarkets', { universe: universe.id }, (err, marketsArray) => {
    if (err) return callback(err)
    dispatch(loadMarketsInfo(marketsArray))

    const marketsData = marketsArray.reduce((p, marketData) => ({
      ...p,
      [marketData.id]: marketData
    }), {})

    dispatch(updateMarketsData(marketsData))
  })
}

export default loadMarkets
