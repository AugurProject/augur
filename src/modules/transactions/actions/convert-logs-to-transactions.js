import async from 'async'
import { augur } from 'services/augurjs'
import { SUCCESS } from 'modules/transactions/constants/statuses'
import { updateTransactionsData } from 'modules/transactions/actions/update-transactions-data'
import { updateMarketsData } from 'modules/markets/actions/update-markets-data'
import { constructTransaction, constructTradingTransaction, constructBasicTransaction } from 'modules/transactions/actions/construct-transaction'

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
      if (marketsData[marketID]) {
        dispatch(convertTradeLogToTransaction(label, data, marketID))
        return next()
      }
      console.log('getting market info for', marketID)
      augur.markets.getMarketInfo({ marketID }, (marketInfo) => {
        if (!marketInfo || marketInfo.error) {
          if (marketInfo && marketInfo.error) console.error('augur.markets.getMarketInfo:', marketInfo)
          return next(`[${label}] couldn't load market info for market ${marketID}: ${JSON.stringify(data)}`)
        }
        dispatch(updateMarketsData({ [marketID]: marketInfo }))
        dispatch(convertTradeLogToTransaction(label, data, marketID))
        next()
      })
    }, err => (err && console.error('convertTradeLogsToTransactions:', err)))
  }
}

export const convertLogToTransaction = (label, log, status, isRetry, cb) => (dispatch, getState) => {
  console.log('convertLogToTransaction', label)
  console.log(log)
  const callback = cb || (e => e && console.error('convertLogToTransaction:', e))
  const hash = log.transactionHash
  if (hash) {
    const transactionData = getState().transactionsData[hash]
    const gasFees = (transactionData && transactionData.gasFees) ? transactionData.gasFees.value : null
    if (log.removed) {
      // TODO rollback: use augur.trading.orderBook.removeOrder for targeted order removal (if order exists/is live)
      //                or just reload orders and trades (brute-force) for this market
      console.debug('!!! log removed:', log)
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
