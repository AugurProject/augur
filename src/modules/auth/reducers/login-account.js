import { UPDATE_LOGIN_ACCOUNT, CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'

const DEFAULT_STATE = {}

export default function (loginAccount = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_LOGIN_ACCOUNT:
      return {
        ...loginAccount,
        ...action.data || {}
      }

    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE

    default:
      return loginAccount
  }
}
