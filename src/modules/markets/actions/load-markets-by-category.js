import { augur } from 'services/augurjs'
import { updateHasLoadedCategory } from 'modules/categories/actions/update-has-loaded-category'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'

export const loadMarketsByCategory = category => (dispatch, getState) => {
  const { env, universe } = getState()

  const params = { category, universe: universe.id }

  if (env['bug-bounty']) {
    params.creator = env['bug-bounty-address']
  }

  augur.markets.getMarkets(params, (err, marketIds) => {
    if (err) return console.error('ERROR findMarketsWithCategory()', err)

    dispatch(updateHasLoadedCategory({ name: category, state: true }))
    if (marketIds.length) {
      dispatch(loadMarketsInfoIfNotLoaded(marketIds))
    }
  })
}
