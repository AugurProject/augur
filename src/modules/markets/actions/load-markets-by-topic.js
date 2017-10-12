import { augur } from 'services/augurjs'
import { updateHasLoadedTopic } from 'modules/topics/actions/update-has-loaded-topic'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

export const loadMarketsByTopic = topic => (dispatch, getState) => {
  const { universe } = getState()
  dispatch(updateHasLoadedTopic({ [topic]: true }))
  augur.topics.findMarketsWithTopic({ topic, universeID: universe.id }, (err, marketIDs) => {
    if (err) {
      console.error('ERROR findMarketsWithTopic()', err)
      dispatch(updateHasLoadedTopic({ [topic]: false }))
    } else if (!marketIDs) {
      console.warn('WARN findMarketsWithTopic()', `no market id's returned`)
      dispatch(updateHasLoadedTopic({ [topic]: false }))
    } else if (marketIDs.length) {
      dispatch(loadMarketsInfo(marketIDs))
    }
  })
}
