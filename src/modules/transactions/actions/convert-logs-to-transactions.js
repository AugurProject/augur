import async from 'async'
import { augur } from 'services/augurjs'
import { SUCCESS } from 'modules/transactions/constants/statuses'
import { updateTransactionsData } from 'modules/transactions/actions/update-transactions-data'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'
import { constructTransaction, constructTradingTransaction, constructBasicTransaction } from 'modules/transactions/actions/construct-transaction'
import logError from 'utils/log-error'

export function convertTradeLogToTransaction(label, data, marketId) {
  return (dispatch, getState) => {
    console.log('convertTradeLogToTransaction', label)
    console.log(data)
    const outcomeIds = Object.keys(data[marketId])
    const numOutcomes = outcomeIds.length
    for (let j = 0; j < numOutcomes; ++j) {
      const outcomeId = outcomeIds[j]
      const numTrades = data[marketId][outcomeId].length
      if (numTrades) {
        for (let k = 0; k < numTrades; ++k) {
          const trade = data[marketId][outcomeId][k]
          const transaction = dispatch(constructTradingTransaction(label, trade, marketId, outcomeId, SUCCESS))
          if (transaction) dispatch(updateTransactionsData(transaction))
        }
      }
    }
  }
}

export function convertTradeLogsToTransactions(label, data, marketId) {
  return (dispatch, getState) => {
    const { marketsData } = getState()
    async.forEachOfSeries(data, (marketTrades, marketId, next) => {
      if (marketsData[marketId] && marketsData[marketId] != null && marketsData[marketId].id != null) {
        dispatch(convertTradeLogToTransaction(label, data, marketId))
        return next()
      }
      console.log('getting market info for', marketId)
      augur.markets.getMarketsInfo({ marketIds: [marketId] }, (err, marketsInfo) => {
        if (!marketsInfo || marketsInfo.error || !Array.isArray(marketsInfo) || !marketsInfo.length || !marketsInfo[0]) {
          if (marketsInfo && marketsInfo.error) console.error('augur.markets.getMarketsInfo:', marketsInfo)
          return next(`[${label}] couldn't load market info for market ${marketId}: ${JSON.stringify(data)}`)
        }
        const marketInfo = marketsInfo[0]
        dispatch(updateMarketsData({ [marketId]: marketInfo }))
        dispatch(convertTradeLogToTransaction(label, data, marketId))
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
          ...transaction,
        },
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
