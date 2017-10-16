import { augur } from 'services/augurjs'
import { updateHasLoadedTopic } from 'modules/topics/actions/update-has-loaded-topic'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

export const loadMarketsByTopic = category => (dispatch, getState) => {
  const { universe } = getState()
  dispatch(updateHasLoadedTopic({ [category]: true }))
  augur.markets.getMarketsInCategory({ category, universe: universe.id }, (err, marketIDs) => {
    if (err) {
      console.error('ERROR findMarketsWithTopic()', err)
      dispatch(updateHasLoadedTopic({ [category]: false }))
    } else if (!marketIDs) {
      console.warn('WARN findMarketsWithTopic()', `no market id's returned`)
      dispatch(updateHasLoadedTopic({ [category]: false }))
    } else if (marketIDs.length) {
      dispatch(loadMarketsInfo(marketIDs))
    }
  })
}
