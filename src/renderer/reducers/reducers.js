import configuration from './configuration'
import blockInfo from './blockInfo'
import serverStatus from './serverStatus'
import notifications from './notifications'
import modal from '../common/components/modal/reducers/modal'

export function createReducer() {
  return {
    configuration,
    blockInfo,
    serverStatus,
    modal,
    notifications
  }
}
