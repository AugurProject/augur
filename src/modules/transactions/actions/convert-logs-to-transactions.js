import async from 'async'
import { augur } from 'services/augurjs'
import { SUCCESS } from 'modules/transactions/constants/statuses'
import { updateTransactionsData } from 'modules/transactions/actions/update-transactions-data'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'
import { constructTransaction, constructTradingTransaction, constructBasicTransaction } from 'modules/transactions/actions/construct-transaction'
import logError from 'utils/log-error'

export function convertTradeLogToTransaction(label, data, marketID) {
  return (dispatch, getState) => {
    console.log('convertTradeLogToTransaction', label)
    console.log(data)
    const outcomeIDs = Object.keys(data[marketID])
    const numOutcomes = outcomeIDs.length
    for (let j = 0; j < numOutcomes; ++j) {
      const outcomeID = outcomeIDs[j]
      const numTrades = data[marketID][outcomeID].length
      if (numTrades) {
        for (let k = 0; k < numTrades; ++k) {
          const trade = data[marketID][outcomeID][k]
          const transaction = dispatch(constructTradingTransaction(label, trade, marketID, outcomeID, SUCCESS))
          if (transaction) dispatch(updateTransactionsData(transaction))
        }
      }
    }
  }
}

export function convertTradeLogsToTransactions(label, data, marketID) {
  return (dispatch, getState) => {
    const { marketsData } = getState()
    async.forEachOfSeries(data, (marketTrades, marketID, next) => {
      if (marketsData[marketID] != null && marketsData[marketID].id != null) {
        dispatch(convertTradeLogToTransaction(label, data, marketID))
        return next()
      }
      console.log('getting market info for', marketID)
      augur.markets.getMarketsInfo({ marketIDs: [marketID] }, (err, marketsInfo) => {
        if (!marketsInfo || marketsInfo.error || !Array.isArray(marketsInfo) || !marketsInfo.length || !marketsInfo[0]) {
          if (marketsInfo && marketsInfo.error) console.error('augur.markets.getMarketsInfo:', marketsInfo)
          return next(`[${label}] couldn't load market info for market ${marketID}: ${JSON.stringify(data)}`)
        }
        const marketInfo = marketsInfo[0]
        dispatch(updateMarketsData({ [marketID]: marketInfo }))
        dispatch(convertTradeLogToTransaction(label, data, marketID))
        next()
      })
    }, err => (err && console.error('convertTradeLogsToTransactions:', err)))
  }
}

export const convertLogToTransaction = (label, log, status, isRetry, callback = logError) => (dispatch, getState) => {
  console.log('convertLogToTransaction', label)
  console.log(log)
  const hash = log.transactionHash
  if (hash) {
    const transactionData = getState().transactionsData[hash]
    const gasFees = (transactionData && transactionData.gasFees) ? transactionData.gasFees.value : null
    if (log.removed) {
      // TODO rollback
      return console.warn('!!! log removed:', log)
    }
    const transaction = dispatch(constructTransaction(label, log, isRetry, callback))
    if (transaction) {
      dispatch(updateTransactionsData({
        [hash]: {
          ...dispatch(constructBasicTransaction(hash, status, log.blockNumber, log.timestamp, gasFees)),
          ...transaction
        }
      }))
      return callback()
    }
  }
}

export const convertLogsToTransactions = (label, logs, isRetry) => (dispatch, getState) => (
  async.eachSeries(logs, (log, nextLog) => (
    dispatch(convertLogToTransaction(label, log, SUCCESS, isRetry, nextLog))
  ), err => (err && console.error(err)))
)
