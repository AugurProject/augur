import { UPDATE_EVENTS_API } from 'modules/contracts/actions/update-contract-api'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (eventsAPI = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_EVENTS_API:
      return action.eventsAPI
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return eventsAPI
  }
}
