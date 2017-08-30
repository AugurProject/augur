import { UPDATE_IS_LOGGED_IN } from 'modules/auth/actions/update-is-logged-in'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'

const DEFAULT_STATE = false

export default function (isLoggedIn = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_IS_LOGGED_IN:
      return action.data.isLoggedIn
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE
    default:
      return isLoggedIn
  }
}
