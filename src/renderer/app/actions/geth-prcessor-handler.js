import { updateServerAttrib } from './serverStatus'
import { startAugurNode } from './local-server-cmds'
import store from '../../store'

export function gethPrcessorHandler(serverStatus) {
  const { GETH_CONNECTED, GETH_FINISHED_SYNCING, AUGUR_NODE_CONNECTED} = serverStatus
  if (GETH_CONNECTED && GETH_FINISHED_SYNCING && !AUGUR_NODE_CONNECTED) {
    store.dispatch(updateServerAttrib({ AUGUR_NODE_CONNECTED: true }))
    startAugurNode()
  }
}


