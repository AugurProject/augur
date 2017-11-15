import { OPEN_ORDER, MARKET_CREATION, POSITION, TRANSFER, REPORTING } from 'modules/transactions/constants/types'
import { PENDING, SUCCESS } from 'modules/transactions/constants/statuses'
import { updateTransactionsData } from 'modules/transactions/actions/update-transactions-data'
import { eachOf } from 'async'

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
    dispatch(updateTransactionsData(transactionsArray.reduce((p, transaction) => {
      transaction.status = SUCCESS
      p[transaction.timestamp] = transaction
      return p
    }, {})))
  }
}

export function addOpenOrderTransactions(openOrders) {
  return (dispatch, getState) => {
    // flatten open orders
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
    dispatch(updateTransactionsData(transactions))
  }
}

export function addPositionTransactions(positions) {
  // flatten positions
  return (dispatch, getState) => {
    dispatch(updateTransactionsData(positions.reduce((p, position) => {
      position.status = PENDING
      position.type = POSITION
      // create unique id
      position.id = simplHashCode(position.marketID + position.outcome)
      p[position.id] = position
      return p
    }, {})))
  }
}

export function addTransferTransactions(transfers) {
  return (dispatch, getState) => {
    dispatch(updateTransactionsData(transfers.reduce((p, transfer) => {
      transfer.type = TRANSFER
      p[transfer.transactionHash] = transfer
      return p
    }, {})))
  }
}

export function addMarketCreationTransactions(marketsCreated) {
  return (dispatch, getState) => {
    const { loginAccount } = getState()
    dispatch(updateTransactionsData(marketsCreated.reduce((p, marketID) => {
      // TODO: go get/add interesting market creation data here
      const transaction = { marketID }
      transaction.type = MARKET_CREATION
      transaction.createdBy = loginAccount
      // create unique id
      transaction.id = simplHashCode(transaction.marketID + transaction.createdBy.address)
      p[transaction.id] = transaction
      return p
    }, {})))
  }
}

export function addReportingTransactions(reports) {
  return (dispatch, getState) => {
    const transactions = {}
    // flatten structure
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
