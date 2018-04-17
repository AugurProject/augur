import { createSelector } from 'reselect'
import { createBigNumber } from 'utils/create-big-number'
import store from 'src/store'
import { selectTransactionsDataState } from 'src/select-state'

import { BUY } from 'modules/transactions/constants/types'
import { PENDING, SUCCESS, FAILED, SUBMITTED, INTERRUPTED } from 'modules/transactions/constants/statuses'

import getValue from 'utils/get-value'
import { formatShares, formatEther, formatRep } from 'utils/format-number'

export default function () {
  return selectTransactions(store.getState())
}

export const selectTransactions = createSelector(
  selectTransactionsDataState,
  (transactionsData) => {
    const tradeGroups = []
    const formattedTransactions = Object.keys(transactionsData || {})
      .reduce((p, id) => {
        const { tradeGroupId } = transactionsData[id]
        if (tradeGroupId) {
          if (tradeGroups.indexOf(tradeGroupId) === -1) {
            tradeGroups.push(tradeGroupId)
            const filteredTransactions = Object.keys(transactionsData).filter(id => transactionsData[id].tradeGroupId === tradeGroupId).map(id => transactionsData[id])

            if (filteredTransactions.length === 1) {
              p.push(formatTransaction(filteredTransactions[0]))
            } else {
              p.push(formatGroupedTransactions(filteredTransactions))
            }
          }

          return p
        }

        p.push(formatTransaction(transactionsData[id]))
        return p
      }, [])
      .sort((a, b) => getValue(b, 'timestamp.timestamp') - getValue(a, 'timestamp.timestamp'))
      .sort((a, b) => a.sortOrder - b.sortOrder)

    return formattedTransactions
  },
)

export function formatTransaction(transaction) {
  return {
    ...transaction,
    data: transaction.data,
    gas: transaction.gas && formatEther(transaction.gas),
    ethTokens: transaction.etherWithoutGas && formatEther(transaction.etherWithoutGas),
    shares: transaction.sharesChange && formatShares(transaction.sharesChange),
    rep: transaction.repChange && formatRep(transaction.repChange),
  }
}

export function formatGroupedTransactions(transactions) {
  const formattedTransactions = transactions.map(transaction => formatTransaction(transaction)).sort((a, b) => getValue(b, 'timestamp.timestamp') - getValue(a, 'timestamp.timestamp'))

  const status = formattedTransactions.reduce((p, transaction) => {
    if (p === FAILED || transaction.status === FAILED) return FAILED
    if (p === INTERRUPTED || transaction.status === INTERRUPTED) return INTERRUPTED
    if (p === PENDING || transaction.status === PENDING) return PENDING
    if (p === SUBMITTED || transaction.status === SUBMITTED) return SUBMITTED
    if (transaction.status === SUCCESS) return SUCCESS

    return p
  }, null)

  const totalShares = formattedTransactions.reduce((p, transaction) => p.plus(createBigNumber(transaction.numShares.value)), createBigNumber(0))

  return {
    status,
    message: `${formattedTransactions[0].type === BUY ? 'Buy' : 'Sell'} ${totalShares.toNumber()} shares of ${formattedTransactions[0].data.outcomeName}`,
    description: formattedTransactions[0].description,
    timestamp: formattedTransactions[formattedTransactions.length - 1].timestamp,
    transactions: formattedTransactions,
  }
}
