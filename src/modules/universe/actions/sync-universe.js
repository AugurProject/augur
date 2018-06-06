import logError from 'utils/log-error'
import { getUniverseProperties, getForkingInfo } from 'modules/account/actions/load-universe-info'

// Synchronize front-end universe state with blockchain universe state.
const syncUniverse = (callback = logError) => (dispatch, getState) => {
  const { universe } = getState()
  dispatch(getUniverseProperties(universe))
  dispatch(getForkingInfo(universe))
  callback(null)
}

export default syncUniverse
