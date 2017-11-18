import { parallel } from 'async'
import { clearReports } from 'modules/reports/actions/update-reports'
import { loadUserTradingHistory } from 'modules/my-positions/actions/load-account-trades'
import { loadCreateMarketHistory } from 'modules/create-market/actions/load-create-market-history'
import { loadFundingHistory } from 'modules/account/actions/load-funding-history'
import { loadReportingHistory } from 'modules/my-reports/actions/load-reporting-history'
import syncUniverse from 'modules/universe/actions/sync-universe'
/* import { updateTransactionsOldestLoadedBlock } from 'modules/transactions/actions/update-transactions-oldest-loaded-block' */
import { updateTransactionsLoading } from 'modules/transactions/actions/update-transactions-loading'
import { clearTransactions } from 'modules/transactions/actions/delete-transaction'
import { loadOpenOrders } from '../../bids-asks/actions/load-open-orders'

export const loadAccountHistory = (loadAllHistory, triggerTransactionsExport) => (dispatch, getState) => {
  const { transactionsOldestLoadedBlock, blockchain, loginAccount, transactionsData } = getState()
  const initialTransactionCount = Object.keys(transactionsData || {}).length

  // Adjust these to constrain the loading boundaries
  const blockChunkSize = 5760 // ~1 Day based on 15 second blocks
  const transactionSoftLimit = 40 // Used if blockChunkSize does not load # of transactions up to the soft limit (approximately two UI pages of transactions)

  const registerBlock = loginAccount.registerBlockNumber // FIXME
  const oldestLoadedBlock = transactionsOldestLoadedBlock || blockchain.currentBlockNumber

  if (!transactionsOldestLoadedBlock) { // Denotes nothing has loaded yet
    dispatch(clearReports())
    dispatch(syncUniverse())
  }

  // TODO: figure out where this data comes from and if it is needed
  /* if (registerBlock && oldestLoadedBlock && oldestLoadedBlock !== registerBlock) { } */

  const options = {}
  if (!loadAllHistory) {
    options.toBlock = oldestLoadedBlock === blockchain.currentBlockNumber ? oldestLoadedBlock : oldestLoadedBlock - 1

    const prospectiveFromBlock = options.toBlock - blockChunkSize
    options.fromBlock = prospectiveFromBlock < registerBlock ?
      registerBlock :
      prospectiveFromBlock
  }

  const constraints = {
    loadAllHistory,
    initialTransactionCount,
    transactionSoftLimit,
    registerBlock,
    blockChunkSize,
    triggerTransactionsExport
  }
  loadTransactions(dispatch, getState, options, constraints, () => {
    dispatch(updateTransactionsLoading(false))
  })

}

export function loadMoreTransactions(dispatch, getState, options, constraints) {
  // TODO: need to pass in options for getting data TBD
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
