import { UPDATE_TRANSACTIONS_DATA } from 'modules/transactions/actions/update-transactions-data'
import { DELETE_TRANSACTION } from 'modules/transactions/actions/delete-transaction'
import { CLEAR_LOGIN_ACCOUNT } from 'modules/auth/actions/update-login-account'

export default function (transactionsData = {}, action) {
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

    case CLEAR_LOGIN_ACCOUNT:
      return {}

    default:
      return transactionsData
  }
}
