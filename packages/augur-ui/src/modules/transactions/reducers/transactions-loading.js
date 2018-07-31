import { UPDATE_TRANSACTIONS_LOADING } from 'modules/transactions/actions/update-transactions-loading'
import { RESET_STATE } from 'modules/app/actions/reset-state'

const DEFAULT_STATE = false

export default function (transactionsLoading = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_TRANSACTIONS_LOADING:
      return action.data.isLoading
    case RESET_STATE:
      return DEFAULT_STATE
    default:
      return transactionsLoading
  }
}
