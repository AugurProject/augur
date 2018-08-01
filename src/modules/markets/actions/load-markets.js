import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'
import { updateHasLoadedCategory } from 'modules/categories/actions/update-has-loaded-search'
import { updateHasLoadedMarkets } from 'modules/markets/actions/update-has-loaded-markets'

// NOTE -- We ONLY load the market ids during this step.
// From here we populate the marketsData
const loadMarkets = (type, callback = logError) => (dispatch, getState) => {
  const { universe } = getState()
  const params = { universe: universe.id }

  console.log('load markets', params)

  augur.markets.getMarkets(params, (err, marketsArray) => {
    if (err) return callback(err)

    const marketsData = marketsArray.reduce((p, id) => ({
      ...p,
      [id]: { id },
    }), {})

    dispatch(updateHasLoadedMarkets(true))
    dispatch(updateMarketsData(marketsData))
    dispatch(updateHasLoadedCategory({ name: type, state: true }))
    callback(null, marketsArray)
  })
}

export default loadMarkets
