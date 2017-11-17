import { MARKET_CREATION, TRANSFER, REPORTING, TRADE } from 'modules/transactions/constants/types'
import { SUCCESS } from 'modules/transactions/constants/statuses'
import { updateTransactionsData } from 'modules/transactions/actions/update-transactions-data'
import { eachOf, each } from 'async'
import moment from 'moment'

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
    const transactions = {}
    each(trades, (trade) => {
      const transaction = { ...trade }
      transaction.status = SUCCESS
      // todo: should have a unique id for each trade
      transaction.id = simplHashCode(transaction.marketID)
      const header = buildHeader(transaction, TRADE)
      transaction.meta = buildMeta(transaction, TRADE, SUCCESS)
      header.transactions = [transaction]
      transactions[transaction.id] = header
    })
    dispatch(updateTransactionsData(transactions))
  }
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
      transactions[transaction.id] = header
    })
    dispatch(updateTransactionsData(transactions))
  }
}

export function addMarketCreationTransactions(marketsCreated) {
  return (dispatch, getState) => {
    const marketCreationData = {}
    const { loginAccount, marketsData } = getState()
    each(marketsCreated, (marketID) => {
      const thisMarketDataID = getMarketById(marketsData, marketID)
      // should be rare case that market info not found
      // need to display something even though can't find market data
      if (thisMarketDataID) {
        const transaction = { marketID, ...thisMarketDataID }
        transaction.timestamp = transaction.creationTime
        transaction.createdBy = loginAccount.address
        transaction.id = marketID
        const header = buildHeader(transaction, MARKET_CREATION, SUCCESS)
        transaction.meta = buildMeta(transaction, MARKET_CREATION, SUCCESS)
        header.transactions = [transaction]
        marketCreationData[transaction.id] = header
      }
    })
    dispatch(updateTransactionsData(marketCreationData))
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
  header.timestamp = buildTimeInfo(item.timestamp)
  header.sortOrder = getSortOrder(type)
  if (type === TRANSFER) {
    header.message = 'Transfer'
    header.description = item.value + ' transfered from ' + item.sender + ' to ' + item.recipient
  }
  if (type === MARKET_CREATION) {
    header.message = 'Market Creation'
    header.description = item.shortDescription
  }
  if (type === TRADE) {
    header.message = 'Trade'
    header.description = 'trade description'
  }
  if (type === REPORTING) {
    header.message = 'Market Reporting'
    header.description = 'Staked ' + item.amountStaked + ' on market ' + item.market.shortDescription == null ? item.marketID : item.market.shortDescription
  }
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

function buildTimeInfo(timestampValue, type) {
  // todo: fill in actual time info
  const timestamp = {}
  if (timestampValue === undefined) {
    timestamp.timestamp = timestampValue
    timestamp.value = 'date time is unknown'
    timestamp.formatted = 'date time is unknown'
    timestamp.formattedLocal = 'date time is unknown'
    timestamp.full = 'date time is unknown'
  } else {
    // TODO: figure out how to get local timezone, currently guessing
    // const timezone = ''
    // const offset = moment().tz(timezone).format('z')
    timestamp.timestamp = timestampValue
    // '2017-10-27T22:49:26.000Z'
    timestamp.value = moment().format()
    // 'Oct 27, 2017 10:49 PM'
    timestamp.formatted = moment().format('MMM D, YY H:m A')
    // 'Oct 27, 2017 3:49 PM (UTC -7)' // need to get time zone diff
    timestamp.formattedLocal = moment().format('MMM D, YY H:m A')
    // 'Fri, 27 Oct 2017 22:49:26 GMT'
    timestamp.full = moment().format('ddd, D MMM YY HH:mm:ss GMT')
  }

  return timestamp
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
  if (type === TRADE) {
    return 10
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
