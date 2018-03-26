import { debounce } from 'lodash'
import { connectAugur } from 'modules/app/actions/init-augur'
import { updateModal } from 'modules/modal/actions/update-modal'
import { MODAL_NETWORK_DISCONNECTED } from 'modules/modal/constants/modal-types'

export const reInitAugur = history => (dispatch, getState) => {
  const retryTimer = 3000 // attempt re-initAugur every 3 seconds.
  const retry = (callback = cb) => {
    const { connection, env } = getState()
    if (!connection.isConnected || !connection.isConnectedToAugurNode) {
      dispatch(updateModal({ type: MODAL_NETWORK_DISCONNECTED, connection, env }))
      if (connection.isReconnectionPaused) {
        // reconnection has been set to paused, recursive call instead
        callback(connection.isReconnectionPaused)
      } else {
        // reconnection isn't paused, retry connectAugur
        dispatch(connectAugur(history, env, false, callback))
      }
    }
  }
  const debounceCall = debounce(retry, retryTimer)
  const cb = (err, connection) => {
    // both args should be undefined if we are connected.
    if (!err && !connection) return
    if (err || !connection.augurNode || !connection.ethereumNode) {
      debounceCall(cb)
    }
  }
  debounceCall(cb)
}
