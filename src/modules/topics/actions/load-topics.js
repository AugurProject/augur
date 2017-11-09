import { augur } from 'services/augurjs'
import { clearTopics, updateTopics } from 'modules/topics/actions/update-topics'
import isObject from 'utils/is-object'
import logError from 'utils/log-error'

const loadTopics = (callback = logError) => (dispatch, getState) => {
  const { universe } = getState()
  if (!universe.id) return callback(null)
  augur.markets.getCategories({ universe: universe.id }, (err, topics) => {
    if (err) return callback(err)
    if (topics == null) return callback(null)
    if (Object.keys(topics).length) {
      dispatch(clearTopics())
      dispatch(updateTopics(topics))
    }
    callback(null, topics)
  })
}

export default loadTopics
