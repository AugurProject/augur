import { UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK } from 'modules/transactions/actions/update-transactions-oldest-loaded-block'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'

const DEFAULT_STATE = null

export default function (transactionsOldestLoadedBlock = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_TRANSACTIONS_OLDEST_LOADED_BLOCK:
      return action.data.block

    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE

    default:
      return transactionsOldestLoadedBlock
  }
}
