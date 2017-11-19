import { parallel } from 'async'
import { clearReports } from 'modules/reports/actions/update-reports'
import { loadUserTradingHistory } from 'modules/my-positions/actions/load-account-trades'
import { loadCreateMarketHistory } from 'modules/create-market/actions/load-create-market-history'
import { loadFundingHistory } from 'modules/account/actions/load-funding-history'
import { loadReportingHistory } from 'modules/my-reports/actions/load-reporting-history'
import syncUniverse from 'modules/universe/actions/sync-universe'
import { updateTransactionsLoading } from 'modules/transactions/actions/update-transactions-loading'
import { clearTransactions } from 'modules/transactions/actions/delete-transaction'
import { loadOpenOrders } from '../../bids-asks/actions/load-open-orders'

export const loadAccountHistory = (loadAllHistory, triggerTransactionsExport) => (dispatch, getState) => {
  const { transactionsOldestLoadedBlock, loginAccount, transactionsData } = getState()
  const initialTransactionCount = Object.keys(transactionsData || {}).length

  const registerBlock = loginAccount.registerBlockNumber // FIXME

  if (!transactionsOldestLoadedBlock) { // Denotes nothing has loaded yet
    dispatch(clearReports())
    dispatch(syncUniverse())
  }

  const options = {}
  if (loadAllHistory) {
    options.earliestCreationTime = null
    options.latestCreationTime = null
  }

  const constraints = {
    loadAllHistory,
    initialTransactionCount,
    registerBlock,
    triggerTransactionsExport
  }

  loadTransactions(dispatch, getState, options, constraints, () => {
    dispatch(updateTransactionsLoading(false))
  })

}

export const loadFilteredTransactions = (beginDate, endDate) => (dispatch, getState) => {
  const options = {}
  const constraints = {
    earliestCreationTime: beginDate,
    latestCreationTime: endDate
  }
  loadTransactions(dispatch, getState, options, constraints, () => {
    // transactions have stop loading
    dispatch(updateTransactionsLoading(false))
  })
}

export function loadMoreTransactions(dispatch, getState, options, constraints) {

  loadTransactions(dispatch, getState, options, constraints, () => {
    // transactions have stop loading
    dispatch(updateTransactionsLoading(false))
  })

}

// transactionsData is constructed from these methods
function loadTransactions(dispatch, getState, options, constraints, cb) {
  dispatch(updateTransactionsLoading(true))
  dispatch(clearTransactions())
  parallel([
    next => dispatch(loadUserTradingHistory(options, (err, values) => {
      if (err) next(err)
      next(null)
    })),
    next => dispatch(loadFundingHistory(options, (err) => {
      if (err) next(err)
      next(null)
    })),
    next => dispatch(loadOpenOrders(options, (err) => {
      if (err) next(err)
      next(null)
    })),
    next => dispatch(loadCreateMarketHistory(options, (err) => {
      if (err) next(err)
      next(null)
    })),
    next => dispatch(loadReportingHistory(options, (err) => {
      if (err) next(err)
      next(null)
    }))
  ], (err) => {
    if (err) return console.error('ERROR loadTransactions: ', err)
    cb(dispatch, getState, options, constraints)
  })
}
