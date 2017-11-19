import { MARKET_CREATION, TRANSFER, REPORTING, TRADE, OPEN_ORDER, BUY, SELL } from 'modules/transactions/constants/types'
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

function groupByMethod(values, prop) {
  let grouped = {}
  groupBy(values, (t, cb) => {
    cb(null, t[prop])
  }, (err, result) => {
    if (!err && result) {
      grouped = result
    }
  })
  return grouped
}

export function addTradeTransactions(trades) {
  return (dispatch, getState) => {
    const { marketsData } = getState()
    const transactions = {}
    const sorted = groupByMethod(trades, 'tradeGroupID')
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
    dispatch(updateTransactionsData(transactions))
  }
}

function buildTradeTransactionGroup(group, marketsData) {
  let header = {}
  let sumBuy = 0
  let sumSell = 0
  each(group, (trade) => {
    if (trade.type === BUY) {
      sumBuy += 1
    }
    if (trade.type === SELL) {
      sumSell += 1
    }
    const localHeader = buildTradeTransaction(trade, marketsData)
    if (Object.keys(header).length === 0) {
      header = localHeader
    } else {
      header.transactions.push(localHeader.transactions[0])
    }
  })
  header.message = `${sumBuy} ${BUY} & ${sumSell} ${SELL} Trades`
  return header
}

function buildTradeTransaction(trade, marketsData) {
  const thisMarketDataID = getMarketById(marketsData, trade.marketID)
  const transaction = { ...trade, market: thisMarketDataID }
  transaction.status = SUCCESS
  // todo: should have a unique id for each trade
  transaction.id = transaction.marketID + transaction.timestamp
  const header = buildHeader(transaction, TRADE)
  const meta = {}
  meta.type = TRADE
  meta.outcome = transaction.outcome
  meta.price = transaction.price
  meta.fee = transaction.settlementFees
  meta['gas fees'] = transaction.hasOwnProperty('gasFees') ? transaction.gasFees : 0
  transaction.meta = meta
  header.status = SUCCESS
  if (transaction.market) {
    header.description = transaction.market.description
  }
  transaction.message = `${transaction.type} ${transaction.amount} Shares @ ${transaction.price} ETH`
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
      const meta = {}
      meta.hash = transaction.id
      meta.recipient = transaction.recipient
      meta.sender = transaction.sender
      meta['gas fees'] = transaction.hasOwnProperty('gasFees') ? transaction.gasFees : 0
      meta.confirmations = transaction.blockNumber
      transaction.meta = meta
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
    each(marketsCreated, (marketID) => {
      const market = getMarketById(marketsData, marketID)
      const transaction = { marketID, market }
      transaction.timestamp = transaction.creationTime
      transaction.createdBy = loginAccount.address
      transaction.id = marketID + transaction.createdBy
      const header = buildHeader(transaction, MARKET_CREATION, SUCCESS)
      const meta = {}
      meta.market = transaction.marketID
      meta['creation fee'] = transaction.hasOwnProperty('creationFee') && transaction.creationFee !== undefined ? transaction.creationFee : 0
      meta['gas fees'] = transaction.hasOwnProperty('gasFees') ? transaction.gasFees : 0
      transaction.meta = meta
      header.message = 'Market Creation'
      if (transaction.market !== undefined) {
        header.description = transaction.description
      }
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
    let index = 100
    eachOf(openOrders, (value, marketID) => {
      const market = getMarketById(marketsData, marketID)
      // TODO: remove index when I figure a comprehensive uique id strategy
      index += 1
      let sumBuy = 0
      let sumSell = 0
      const marketHeader = {}
      marketHeader.status = 'Market Outcome Trade'
      marketHeader.hash = marketID + index
      if (market !== undefined) {
        marketHeader.timestamp = formatDate(market.creationTime)
        marketHeader.description = market.description
      }
      marketHeader.sortOrder = getSortOrder(OPEN_ORDER)
      marketHeader.id = marketHeader.hash
      const marketTradeTransactions = []
      eachOf(value, (value2, index) => {
        eachOf(value2, (value3, type) => {
          eachOf(value3, (value4, outcomeID) => {
            const transaction = { marketID, type, outcomeID, ...value4 }
            transaction.id = transaction.transactionHash + transaction.transactionIndex
            transaction.message = `${transaction.orderState} - ${type} ${transaction.amount} Shares @ ${transaction.price} ETH`
            const meta = {}
            // need better way of setting parameter name
            const creationTime = formatDate(transaction.creationTime)
            meta.timestamp = creationTime.full
            meta.outcome = outcomeID // need to get payNumerators
            meta.status = transaction.orderState
            meta.amount = transaction.fullPrecisionAmount
            meta.price = transaction.fullPrecisionPrice
            meta['gas fees'] = transaction.hasOwnProperty('gasFees') ? transaction.gasFees : 0
            transaction.meta = meta
            marketTradeTransactions.push(transaction)
            if (type === BUY) {
              sumBuy += 1
            }
            if (type === SELL) {
              sumSell += 1
            }
          })
        })
      })
      marketHeader.message = `${sumBuy} ${BUY} & ${sumSell} ${SELL} Orders`
      marketHeader.transactions = marketTradeTransactions
      transactions[marketHeader.id] = marketHeader
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
          transaction.id = transaction.marketID + transaction.amountStaked
          const meta = {}
          meta.marketID = transaction.marketID
          meta.staked = `${transaction.amountStaked} REP`
          meta.numerators = JSON.stringify(transaction.payoutNumerators)
          meta['gas fees'] = transaction.hasOwnProperty('gasFees') ? transaction.gasFees : 0
          transaction.meta = meta
          const header = buildHeader(transaction, REPORTING, SUCCESS)
          header.transactions = [transaction]
          header.message = 'Market Reporting'
          header.description = `Staked  ${transaction.amountStaked} REP on market ${market.description}`
          // create unique id
          transactions[transaction.id] = header
        })
      })
    })
    dispatch(updateTransactionsData(transactions))
  }
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
