import { createSelector } from 'reselect'
import store from 'src/store'
import { selectTransactions } from 'modules/transactions/selectors/transactions'
import { PENDING, SUCCESS, FAILED, INTERRUPTED } from 'modules/transactions/constants/statuses'

export default function () {
  return selectTransactionsTotals(store.getState())
}

export const selectTransactionsTotals = createSelector(
  selectTransactions,
  (transactions) => {
    const o = {
      numWorking: 0,
      numPending: 0,
      numComplete: 0,
      numWorkingAndPending: 0,
      numTotal: 0,
      title: '',
    }

    o.transactions = transactions.forEach((transaction) => {
      o.numTotal += 1
      if (transaction.status === PENDING) {
        o.numPending += 1
      } else if ([SUCCESS, FAILED, INTERRUPTED].indexOf(transaction.status) >= 0) {
        o.numComplete += 1
      } else {
        o.numWorking += 1
      }
    })

    o.numWorkingAndPending = o.numPending + o.numWorking

    if (o.numWorkingAndPending) {
      o.title =
      `Transaction${(o.numWorkingAndPending !== 1 ? 's' : '')} Working`
      o.shortTitle = `${o.numPending} Working`
    } else {
      o.title = `${o.numTotal} Transaction${(o.numTotal !== 1 ? 's' : '')}`
      o.shortTitle = `${o.numTotal} Total`
    }

    return o
  },
)
