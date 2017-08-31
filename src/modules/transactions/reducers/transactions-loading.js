import { UPDATE_TRANSACTIONS_LOADING } from 'modules/transactions/actions/update-transactions-loading'

const DEFAULT_STATE = false

export default function (transactionsLoading = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_TRANSACTIONS_LOADING:
      return action.data.isLoading

    default:
      return transactionsLoading
  }
}
