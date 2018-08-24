
import { RESET_STATE } from '../app/actions/reset-state'
import { UPDATE_SERVER_ATTRIB } from '../app/actions/serverStatus'

const DEFAULT_STATE = {}

export default function (serverStatus = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_SERVER_ATTRIB:
      return Object.assign(serverStatus, action.attrib)
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return serverStatus
  }
}
