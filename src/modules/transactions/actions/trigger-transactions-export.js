import { loadAccountHistory } from 'modules/auth/actions/load-account-history'
import { selectTransactions } from 'modules/transactions/selectors/transactions'

export const triggerTransactionsExport = () => (dispatch, getState) => {
  const { transactionsLoading } = getState()

  if (!transactionsLoading) {
    // trigger download
    const transactions = selectTransactions(getState())
    const transactionsDataString = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions))
    const a = document.createElement('a')

    a.setAttribute('href', transactionsDataString)
    a.setAttribute('download', 'AugurTransactions.json')
    a.click()
  } else {
    // trigger load all transactions and give it this function as a callback.
    dispatch(loadAccountHistory(true, triggerTransactionsExport))
  }
}
