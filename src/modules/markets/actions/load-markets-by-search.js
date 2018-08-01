import { augur } from 'services/augurjs'
import logError from 'utils/log-error'
import { updateHasLoadedSearch } from 'modules/categories/actions/update-has-loaded-search'

export const loadMarketsBySearch = (terms, callback = logError) => (dispatch, getState) => {
  const { universe } = getState()

  if (!terms || terms.length === 0) callback([])
  const search = (terms && terms.length > 1) ? terms.join(' OR ').trim(' OR ') : terms[0]

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
      dispatch(updateHasLoadedSearch({ name: 'search', state: true, terms }))
      callback(null, marketIds)
    },
  )
}
