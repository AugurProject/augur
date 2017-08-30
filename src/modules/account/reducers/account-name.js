import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'
import { UPDATE_ACCOUNT_NAME } from 'modules/account/actions/update-account-name'

const DEFAULT_STATE = null

export default function (accountName = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_ACCOUNT_NAME:
      return action.data.name
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE
    default:
      return accountName
  }
}
