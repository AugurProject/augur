import { UPDATE_TRANSACTIONS_DATA } from 'modules/transactions/actions/update-transactions-data'
import { DELETE_TRANSACTION, CLEAR_TRANSACTION_DATA } from 'modules/transactions/actions/delete-transaction'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'
import { RESET_STATE } from 'modules/app/actions/reset-state'
import { PENDING } from 'modules/transactions/constants/statuses'

const DEFAULT_STATE = {}

export default function (transactionsData = DEFAULT_STATE, action) {
  switch (action.type) {
    case UPDATE_TRANSACTIONS_DATA:
      return Object.keys(action.transactionsData).reduce((p, transactionID) => {
        p[transactionID] = {
          ...transactionsData[transactionID],
          ...action.transactionsData[transactionID],
          id: transactionID
        }
        return p
      }, { ...transactionsData })
    case DELETE_TRANSACTION:
      return Object.keys(transactionsData).reduce((p, transactionID) => {
        if (action.transactionID !== transactionID) {
          p[transactionID] = transactionsData[transactionID]
        }
        return p
      }, {})
    case CLEAR_TRANSACTION_DATA:
      return Object.keys(transactionsData).reduce((p, transactionID) => {
        if (transactionsData[transactionID].status === PENDING) {
          p[transactionID] = transactionsData[transactionID]
        }
        return p
      }, {})
    case RESET_STATE:
    case CLEAR_LOGIN_ACCOUNT:
      return DEFAULT_STATE
    default:
      return transactionsData
  }
}
