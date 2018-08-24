import connections from './connections'
import blockInfo from './blockInfo'
import serverStatus from './serverStatus'

export function createReducer() {
  return {
    connections,
    blockInfo,
    serverStatus
  }
}
