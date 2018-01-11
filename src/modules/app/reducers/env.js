import { UPDATE_ENV } from 'modules/app/actions/update-env'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = {}

export default function (env = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_ENV:
      return action.env
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return env
  }
}
