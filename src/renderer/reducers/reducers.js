import connections from './connections'
import blockInfo from './blockInfo'
import serverStatus from './serverStatus'
import modal from '../common/components/modal/reducers/modal'

export function createReducer() {
  return {
    connections,
    blockInfo,
    serverStatus,
    modal
  }
}
