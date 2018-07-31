import { updateModal } from 'modules/modal/actions/update-modal'
import { updateAugurNodeConnectionStatus, updateConnectionStatus } from 'modules/app/actions/update-connection'
import { reInitAugur } from 'modules/app/actions/re-init-augur'
import { MODAL_NETWORK_DISCONNECTED } from 'modules/modal/constants/modal-types'

export const handleAugurNodeDisconnect = (history, event) => (dispatch, getState) => {
  console.warn('Disconnected from augur-node', event)
  const { connection, env } = getState()
  if (connection.isConnectedToAugurNode) {
    dispatch(updateModal({ type: MODAL_NETWORK_DISCONNECTED, connection, env }))
    dispatch(updateAugurNodeConnectionStatus(false))
  }
  dispatch(reInitAugur(history))
}

export const handleEthereumDisconnect = (history, event) => (dispatch, getState) => {
  console.warn('Disconnected from Ethereum', event)
  const { connection, env } = getState()
  if (connection.isConnected) {
    dispatch(updateModal({ type: MODAL_NETWORK_DISCONNECTED, connection, env }))
    dispatch(updateConnectionStatus(false))
  }
  dispatch(reInitAugur(history))
}
