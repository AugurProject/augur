import { augur } from 'services/augurjs'
import { updateHasLoadedCategory } from 'modules/categories/actions/update-has-loaded-category'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { updateMarketsFilteredSorted, clearMarketsFilteredSorted } from 'modules/markets/actions/update-markets-filtered-sorted'

export const loadMarketsByCategory = category => (dispatch, getState) => {
  const { universe } = getState()

  const params = { category, universe: universe.id }

  /* TODO when getMarketsInCategory takes a creator argument
  let getMarkets = augur.markets.getMarkets;

  if (env['bug-bounty']) {
    params.creator = env['bug-bounty-address']
  }
  */

  augur.markets.getMarketsInCategory(params, (err, marketIDs) => {
    if (err) {
      console.error('ERROR findMarketsWithCategory()', err)
      dispatch(updateHasLoadedCategory({ [category]: false }))
    } else if (!marketIDs) {
      console.warn('WARN findMarketsWithCategory()', `no market id's returned`)
      dispatch(updateHasLoadedCategory({ [category]: false }))
    } else if (marketIDs.length) {
      dispatch(updateHasLoadedCategory({ [category]: true }))
      dispatch(clearMarketsFilteredSorted())
      dispatch(updateMarketsFilteredSorted(marketIDs))
      dispatch(loadMarketsInfo(marketIDs))
    }
  })
}
