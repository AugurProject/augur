import { MARKET_CREATION, TRANSFER, REPORTING, TRADE, OPEN_ORDER } from 'modules/transactions/constants/types'
import { SUCCESS } from 'modules/transactions/constants/statuses'
import { updateTransactionsData } from 'modules/transactions/actions/update-transactions-data'
import { eachOf, each, groupBy } from 'async'
import { formatDate } from 'src/utils/format-date'

export function addTransactions(transactionsArray) {
  return (dispatch, getState) => {
    dispatch(updateTransactionsData(transactionsArray.reduce((p, transaction) => {
      p[transaction.timestamp] = transaction
      return p
    }, {})))
  }
}

export function addTradeTransactions(trades) {
  return (dispatch, getState) => {
    const { marketsData } = getState()
    const transactions = {}
    let sorted = trades
    groupBy(trades, function (t, cb) {
      return cb(null, t.tradeGroupID)
    }, (err, result) => {
      if (!err && result) {
        sorted = result
      }
    })
    // todo: need fallback if groupBy fails and groups aren't created
    each(sorted, (group) => {
      if (group[0].tradeGroupID === undefined) {
        each(group, (trade) => {
          const header = buildTradeTransaction(trade, marketsData)
          transactions[header.hash] = header
        })
      } else {
        const header = buildTradeTransactionGroup(group, marketsData)
        transactions[header.hash] = header
      }
    })
//    dispatch(updateTransactionsData(transactions))
  }
}

function buildTradeTransactionGroup(group, marketsData) {
  let header = {}
  each(group, (trade) => {
    const localHeader = buildTradeTransaction(trade, marketsData)
    if (Object.keys(header).length === 0) {
      header = localHeader
    } else {
      header.transactions.push(localHeader.transactions[0])
    }
  })
  return header
}

function addMarketInfoIfExists(rawTransaction, marketsData) {
  if (rawTransaction.hasOwnProperty('marketID')) {
    rawTransaction.market = getMarketById(marketsData, rawTransaction.marketID)
  }
}

function buildTradeTransaction(trade, marketsData) {
  addMarketInfoIfExists(trade, marketsData)
  const transaction = { ...trade }
  transaction.status = SUCCESS
  // todo: should have a unique id for each trade
  transaction.id = simplHashCode(transaction.marketID + transaction.timestamp)
  const header = buildHeader(transaction, TRADE)
  transaction.meta = buildMeta(transaction, TRADE, SUCCESS)
  header.message = 'Trade'
  header.description = 'trade description'
  transaction.message = 'more specific message about transaction'
  header.transactions = [transaction]
  return header
}

export function addTransferTransactions(transfers) {
  return (dispatch, getState) => {
    const transactions = {}
    each(transfers, (transfer) => {
      const transaction = { ...transfer }
      transaction.id = transaction.transactionHash
      const header = buildHeader(transaction, TRANSFER, SUCCESS)
      header.transactions = [transaction]
      transaction.meta = buildMeta(transaction, TRANSFER, SUCCESS)
      header.message = 'Transfer'
      header.description = transaction.value + ' transfered from ' + transaction.sender + ' to ' + transaction.recipient
      transactions[transaction.id] = header
    })
    dispatch(updateTransactionsData(transactions))
  }
}

export function addMarketCreationTransactions(marketsCreated) {
  return (dispatch, getState) => {
    const marketCreationData = {}
    const { loginAccount, marketsData } = getState()
    // placeholder until get unique ID
    let index = 0
    each(marketsCreated, (marketID) => {
      const thisMarketDataID = getMarketById(marketsData, marketID)
      const transaction = { marketID, ...thisMarketDataID }
      transaction.timestamp = transaction.creationTime
      transaction.createdBy = loginAccount.address
      index += 1000
      transaction.id = marketID + index
      const header = buildHeader(transaction, MARKET_CREATION, SUCCESS)
      transaction.meta = buildMeta(transaction, MARKET_CREATION, SUCCESS)
      header.message = 'Market Creation'
      header.description = transaction.shortDescription
      header.transactions = [transaction]
      marketCreationData[transaction.id] = header
    })
    dispatch(updateTransactionsData(marketCreationData))
  }
}

export function addOpenOrderTransactions(openOrders) {
  return (dispatch, getState) => {
    const { marketsData } = getState()
    // flatten open orders
    const transactions = {}
    eachOf(openOrders, (value, marketID) => {
      eachOf(value, (value2, index) => {
        eachOf(value2, (value3, type) => {
          eachOf(value3, (value4, outcomeID) => {
            const market = getMarketById(marketsData, marketID)
            const transaction = { marketID, type, outcomeID, ...value4, market }
            // create unique id
            transaction.id = simplHashCode(transaction.marketID + transaction.outcomeID)
            const header = buildHeader(transaction, OPEN_ORDER, SUCCESS)
            transaction.meta = buildMeta(transaction, OPEN_ORDER, SUCCESS)
            header.message = 'Order'
            header.status = 'status'
            header.desciption = 'description'
            header.timestamp = formatDate(transaction.creationTime)
            header.transactions = [transaction]
            transactions[transaction.id] = header
          })
        })
      })
    })
    dispatch(updateTransactionsData(transactions))
  }
}

export function addReportingTransactions(reports) {
  return (dispatch, getState) => {
    const { marketsData } = getState()
    const transactions = {}
    eachOf(reports, (value, universe) => {
      eachOf(value, (value1, marketID) => {
        eachOf(value1, (report, index) => {
          const market = getMarketById(marketsData, marketID)
          const transaction = { universe, marketID, ...report, market }
          transaction.id = simplHashCode(transaction.marketID + transaction.amountStaked)
          transaction.meta = buildMeta(transaction, REPORTING, SUCCESS)
          const header = buildHeader(transaction, REPORTING, SUCCESS)
          header.transactions = [transaction]
          header.message = 'Market Reporting'
          header.description = 'Staked ' + transaction.amountStaked + ' on market ' + transaction.market.shortDescription == null ? transaction.marketID : transaction.market.shortDescription
          // create unique id
          transactions[transaction.id] = header
        })
      })
    })
    dispatch(updateTransactionsData(transactions))
  }
}

export function addTransaction(transaction) {
  return addTransactions([transaction])
}

export function makeTransactionID(currentBlock) {
  return `${currentBlock}-${Date.now()}`
}

function simplHashCode(str) {
  // TOOD: add hashing function to reduce string to simple unique identifier
  return str
}

function buildHeader(item, type, status) {
  const header = {}
  header.status = status
  header.hash = item.id
  // TODO: need to sort by datetime in render
  header.timestamp = formatDate(item.timestamp)
  header.sortOrder = getSortOrder(type)
  return header
}

function buildMeta(item, type, status) {
  const meta = {}
  meta.status = status
  meta.type = item.type
  if (type === TRANSFER) {
    meta.hash = item.id
    meta.confirmations = item.blockNumber
    meta.gasCost = 'GET REAL GAS COSTS'
  }
  if (type === TRADE) {
    meta.type = item.type
    meta.outcome = item.outcome
    meta.price = item.price
    meta.fee = item.settlementFees
    meta.gasCost = 'GET REAL GAS COSTS'
  }
  if (type === MARKET_CREATION) {
    meta.market = item.marketID
    meta.creationFee = item.creationFee
    meta.gasCost = 'GET REAL GAS COSTS'
  }
  if (type === REPORTING) {
    meta.staked = item.amountStaked
    meta.market = item.marketID
    meta.creationFee = item.creationFee
    meta.payout = item.payoutNumerators
    meta.gasCost = 'GET REAL GAS COSTS'
  }
  return meta
}

function getMarketById(marketsData, marketID) {
  const id = Object.keys(marketsData).find((myMarketID) => {
    const market = marketsData[myMarketID]
    return market.id === marketID
  })
  return marketsData[id]
}

// TODO: this should be dynamic by user control
function getSortOrder(type) {
  if (type === OPEN_ORDER) {
    return 10
  }
  if (type === TRADE) {
    return 20
  }
  if (type === TRANSFER) {
    return 50
  }
  if (type === MARKET_CREATION) {
    return 90
  }
  if (type === REPORTING) {
    return 100
  }
  return 1000
}
