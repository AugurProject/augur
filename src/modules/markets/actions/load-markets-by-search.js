import { augur } from 'services/augurjs'
import { updateHasLoadedCategory } from 'modules/categories/actions/update-has-loaded-category'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'

export const loadMarketsBySearch = (search, type) => (dispatch, getState) => {
  const { universe } = getState()
  augur.augurNode.submitRequest(
    'getMarketsSearch',
    {
      universe: universe.id,
      search,
    }, (err, marketIds) => {
      if (err) {
        console.error('ERROR loadMarketsBySearch()', err)
      } else if (!marketIds) {
        console.warn('WARN loadMarketsBySearch()', `no market id's returned`)
        dispatch(updateHasLoadedCategory({ [type]: false }))
      } else if (marketIds.length) {
        dispatch(updateHasLoadedCategory({ [type]: true }))
        dispatch(loadMarketsInfoIfNotLoaded(marketIds))
      }
    },
  )
}
