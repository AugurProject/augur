import { UPDATE_IS_LOGGED } from 'modules/auth/actions/update-is-logged'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'

const DEFAULT_STATE = false

export default function (isLogged = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_IS_LOGGED:
      return action.data.isLogged
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE
    default:
      return isLogged
  }
}
