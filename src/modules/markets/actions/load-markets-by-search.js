import { augur } from 'services/augurjs'
import { updateHasLoadedCategory } from 'modules/categories/actions/update-has-loaded-search'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'

export const loadMarketsBySearch = (search, type) => (dispatch, getState) => {
  const { universe } = getState()

  augur.augurNode.submitRequest(
    'getMarketsSearch',
    {
      universe: universe.id,
      search,
    }, (err, marketIds) => {
      if (err) return console.error('ERROR loadMarketsBySearch()', err)
      dispatch(updateHasLoadedCategory({ name: type, state: true, term: search }))
      if (marketIds.length) {
        dispatch(loadMarketsInfoIfNotLoaded(marketIds))
      }
    },
  )
}
