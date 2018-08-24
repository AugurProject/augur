import connections from './connections'
import augurNodeBlockInfo from './augurNodeBlockInfo'
import serverStatus from './serverStatus'

export function createReducer() {
  return {
    connections,
    augurNodeBlockInfo,
    serverStatus
  }
}
