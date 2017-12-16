import { augur } from 'services/augurjs'
import { updateHasLoadedTopic } from 'modules/topics/actions/update-has-loaded-topic'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'
import { updateMarketsFilteredSorted, clearMarketsFilteredSorted } from 'modules/markets/actions/update-markets-filtered-sorted'

export const loadMarketsByTopic = category => (dispatch, getState) => {
  const { universe } = getState()

  augur.markets.getMarketsInCategory({ category, universe: universe.id }, (err, marketIDs) => {
    if (err) {
      console.error('ERROR findMarketsWithTopic()', err)
      dispatch(updateHasLoadedTopic({ [category]: false }))
    } else if (!marketIDs) {
      console.warn('WARN findMarketsWithTopic()', `no market id's returned`)
      dispatch(updateHasLoadedTopic({ [category]: false }))
    } else if (marketIDs.length) {
      dispatch(updateHasLoadedTopic({ [category]: true }))
      dispatch(clearMarketsFilteredSorted())
      dispatch(updateMarketsFilteredSorted(marketIDs))
      dispatch(loadMarketsInfo(marketIDs))
    }
  })
}
