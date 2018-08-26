import configuration from './configuration'
import blockInfo from './blockInfo'
import serverStatus from './serverStatus'
import modal from '../common/components/modal/reducers/modal'

export function createReducer() {
  return {
    configuration,
    blockInfo,
    serverStatus,
    modal
  }
}
