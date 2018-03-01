import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'
import { updateMarketsFilteredSorted, clearMarketsFilteredSorted } from 'modules/markets/actions/update-markets-filtered-sorted'
import { updateHasLoadedMarkets } from 'modules/markets/actions/update-has-loaded-markets'

// NOTE -- We ONLY load the market ids during this step.
// From here we populate the marketsData + clearMarketsFilteredSorted
// Any subsequent use of markets should check against the marketsFilteredSorted array for ids, then ref the marketsData (or allMarkets) for the corresponding data (or load info as needed)
const loadMarkets = (callback = logError) => (dispatch, getState) => {
  const { env, universe } = getState()

  let getMarketsFunc
  const params = { universe: universe.id }
  getMarketsFunc = augur.markets.getMarkets

  if (env['bug-bounty']) {
    params.creator = env['bug-bounty-address']
    getMarketsFunc = augur.markets.getMarketsCreatedByUser
  }

  getMarketsFunc(params, (err, marketsArray) => {
    if (err) return callback(err)

    const marketsData = marketsArray.reduce((p, id) => ({
      ...p,
      [id]: { id },
    }), {})
    // dispatch(clearMarketsData())
    dispatch(updateHasLoadedMarkets(true))
    dispatch(updateMarketsData(marketsData))

    dispatch(clearMarketsFilteredSorted())
    dispatch(updateMarketsFilteredSorted(marketsArray))
    callback(null, marketsArray)
  })
}

export default loadMarkets
