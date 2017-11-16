import speedomatic from 'speedomatic'
import { OPEN_ORDER, MARKET_CREATION, TRANSFER, REPORTING, TRADE, CREATE_MARKET } from 'modules/transactions/constants/types'
import { SUCCESS } from 'modules/transactions/constants/statuses'
import { updateTransactionsData } from 'modules/transactions/actions/update-transactions-data'
import { eachOf, each } from 'async'

export function addTransactions(transactionsArray) {
  return (dispatch, getState) => {
    dispatch(updateTransactionsData(transactionsArray.reduce((p, transaction) => {
      p[transaction.timestamp] = transaction
      return p
    }, {})))
  }
}

export function addTradeTransactions(transactionsArray) {
  return (dispatch, getState) => {
    /*
    dispatch(updateTransactionsData(transactionsArray.reduce((p, transaction) => {
      transaction.status = SUCCESS
      // todo: should have a unique id for each trade
      transaction.hash = simplHashCode(transaction.marketID)
      const header = buildHeader(transaction, TRADE)
      header.transactions = [transaction]
      header.transactionID = transaction.hash
      p[header.transactionID] = header
      return p
    }, {})))
    */
  }
}

export function addOpenOrderTransactions(openOrders) {
  return (dispatch, getState) => {
    const transactions = {}
    eachOf(openOrders, (value, marketID) => {
      eachOf(value, (value2, index) => {
        eachOf(value2, (value3, type) => {
          eachOf(value3, (value4, outcomeID) => {
            const transaction = { marketID, type, outcomeID, ...value4 }
            transaction.type = OPEN_ORDER
            // create unique id
            transaction.id = simplHashCode(transaction.marketID + transaction.outcomeID)
            transactions[transaction.id] = transaction
          })
        })
      })
    })
  //  dispatch(updateTransactionsData(transactions))
  }
}

export function addTransferTransactions(transfers) {
  return (dispatch, getState) => {
    dispatch(updateTransactionsData(transfers.reduce((p, transfer) => {
      const header = buildHeader(transfer, TRANSFER, SUCCESS)
      header.transactionID = transfer.transactionHash
      header.transactions = [transfer]
      transfer.meta = buildMeta(transfer, TRANSFER, SUCCESS)
      p[transfer.transactionHash] = header
      return p
    }, {})))
  }
}

export function addMarketCreationTransactions(marketsCreated) {
  return (dispatch, getState) => {
    const marketCreationData = {}
    const { loginAccount, marketsData } = getState()
    each(marketsCreated, (marketID) => {
      const thisMarketDataID = Object.keys(marketsData).find((myMarketID) => {
        const market = marketsData[myMarketID]
        return market.id === marketID
      })
      // should be rare case that market info not found
      // need to display something even though can't find market data
      if (thisMarketDataID) {
        const transaction = { marketID, ...marketsData[thisMarketDataID] }
        transaction.createdBy = loginAccount
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
    const transactions = {}
    eachOf(reports, (value, universe) => {
      eachOf(value, (value1, marketID) => {
        eachOf(value1, (report, index) => {
          const transaction = { universe, marketID, ...report }
          transaction.type = REPORTING
          // create unique id
          transaction.id = simplHashCode(transaction.marketID + transaction.amountStaked)
          transactions[transaction.id] = transaction
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
  if (type === TRANSFER) {
    header.hash = item.transactionHash
    header.status = status
    header.description = item.value + ' transfered from ' + item.sender + ' to ' + item.recipient
    header.message = item.value + ' ETH transfered from ' + item.sender + ' to ' + item.recipient
    header.timestamp = buildTimeInfo(item, type)
  }
  if (type === MARKET_CREATION) {
    header.hash = item.id
    header.status = status
    header.description = item.shortDescription
    header.message = 'Market ' + item.categroy + ' created by ' + item.author
    header.timestamp = buildTimeInfo(item, type)
  }
  return header
}

function buildMeta(item, type, status) {
  const meta = {}
  if (type === TRANSFER) {
    meta.hash = item.transactionHash
    // todo: figure out what is close to 'frozen funds'
    meta.status = status
    meta.gasCost = '0.3940 ETH'
    // todo: get actual confirmations
    meta.confirmations = item.blockNumber
  }
  if (type === MARKET_CREATION) {
    meta.status = status
    meta.type = item.type
    meta.creationFee = item.creationFee
  }
  return meta
}

function buildTimeInfo(item, type) {
  // todo: fill in actual time info
  const timestamp = {}
  timestamp.value = '2017-10-27T22:49:26.000Z'
  timestamp.formatted = 'Oct 27, 2017 10:49 PM'
  timestamp.formattedLocal = 'Oct 27, 2017 3:49 PM (UTC -7)'
  timestamp.full = 'Fri, 27 Oct 2017 22:49:26 GMT'
  timestamp.timestamp = 1509144566000

  return timestamp
}
