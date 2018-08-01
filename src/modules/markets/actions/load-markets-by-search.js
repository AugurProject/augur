import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { updateHasLoadedCategory } from 'modules/categories/actions/update-has-loaded-search'

export const loadMarketsBySearch = (search, type, callback = logError) => (dispatch, getState) => {
  const { universe } = getState()

  console.log('load markets by search', search)

  augur.augurNode.submitRequest(
    'getMarketsSearch',
    {
      universe: universe.id,
      search,
    }, (err, marketIds) => {
      if (err) {
        callback(err)
        return console.error('ERROR loadMarketsBySearch()', err)
      }
      dispatch(updateHasLoadedCategory({ name: type, state: true, term: search }))
      callback(null, marketIds)
    },
  )
}
