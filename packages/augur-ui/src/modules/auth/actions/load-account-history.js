import { parallel } from 'async'
import { loadAccountTrades } from 'modules/my-positions/actions/load-account-trades'
import { loadCreateMarketHistory } from 'modules/create-market/actions/load-create-market-history'
import { loadFundingHistory } from 'modules/account/actions/load-funding-history'
import { loadReportingHistory } from 'modules/my-reports/actions/load-reporting-history'
import { updateTransactionsLoading } from 'modules/transactions/actions/update-transactions-loading'
import { clearTransactions } from 'modules/transactions/actions/delete-transaction'
import { augur } from 'services/augurjs'

export const loadAccountHistory = (beginTime, endTime) => (dispatch, getState) => {
  const options = {
    earliestCreationTime: beginTime,
    latestCreationTime: endTime,
  }

  loadTransactions(dispatch, getState, options, () => {
    dispatch(updateTransactionsLoading(false))
  })
}

function loadTransactions(dispatch, getState, options, cb) {
  const allOptions = Object.assign(options, { orderState: augur.constants.ORDER_STATE.ALL })
  dispatch(updateTransactionsLoading(true))
  dispatch(clearTransactions())
  parallel([
    next => dispatch(loadAccountTrades(allOptions, (err) => {
      if (err) next(err)
      next(null)
    })),
    next => dispatch(loadFundingHistory(options, (err) => {
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
    })),
  ], (err) => {
    if (err) return console.error('ERROR loadTransactions: ', err)
    cb(dispatch, getState, options)
  })
}
