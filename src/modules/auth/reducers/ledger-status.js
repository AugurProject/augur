import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'
import { UPDATE_LEDGER_STATUS } from 'modules/auth/actions/update-ledger-status'
import { NOT_CONNECTED } from 'modules/auth/constants/ledger-status'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = NOT_CONNECTED

export default function (ledgerStatus = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_LEDGER_STATUS:
      return action.data
    case CLEAR_LOGIN_ACCOUNT:
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return ledgerStatus
  }
}
