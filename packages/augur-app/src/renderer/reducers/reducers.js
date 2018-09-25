import configuration from './configuration'
import gethBlockInfo from './gethBlockInfo'
import augurNodeBlockInfo from './augurNodeBlockInfo'
import serverStatus from './serverStatus'
import notifications from './notifications'
import modal from '../common/components/modal/reducers/modal'

export function createReducer() {
  return {
    configuration,
    gethBlockInfo,
    augurNodeBlockInfo,
    serverStatus,
    modal,
    notifications
  }
}
