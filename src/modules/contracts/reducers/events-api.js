import { UPDATE_EVENTS_API } from 'modules/contracts/actions/update-contract-api'

export default function (eventsAPI = {}, action) {
  switch (action.type) {
    case UPDATE_EVENTS_API:
      return action.eventsAPI
    default:
      return eventsAPI
  }
}
