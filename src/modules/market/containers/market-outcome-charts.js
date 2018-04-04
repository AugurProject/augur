import { connect } from 'react-redux'
import memoize from 'memoizee'
import { isEmpty } from 'lodash'

import MarketOutcomeCharts from 'modules/market/components/market-outcome-charts/market-outcome-charts'

import { selectMarket } from 'modules/market/selectors/market'

import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'

const orderAndAssignCumulativeShares = memoize((orderBook) => {
  const rawBids = ((orderBook || {})[BIDS] || []).slice()
  const bids = rawBids
    .sort((a, b) => b.price.value - a.price.value)
    .reduce((p, order, i, orders) => [
      ...p,
      {
        price: order.price,
        shares: order.shares,
        cumulativeShares: p[i - 1] != null ? p[i - 1].cumulativeShares + order.shares.value : order.shares.value,
      },
    ], [])

  const rawAsks = ((orderBook || {})[ASKS] || []).slice()
  const asks = rawAsks
    .sort((a, b) => a.price.value - b.price.value)
    .reduce((p, order, i, orders) => [
      ...p,
      {
        price: order.price,
        shares: order.shares,
        cumulativeShares: p[i - 1] != null ? p[i - 1].cumulativeShares + order.shares.value : order.shares.value,
      },
    ], [])
    .sort((a, b) => b.price.value - a.price.value)

  return {
    bids,
    asks,
  }
})

const orderForMarketDepth = memoize((orderBook) => {
  const rawBids = ((orderBook || {})[BIDS] || []).slice()
  const bids = rawBids
    .reduce((p, order) => [...p, [order.cumulativeShares, order.price.value, order.shares.value]], [])
  const rawAsks = ((orderBook || {})[ASKS] || []).slice()
  const asks = rawAsks
    .sort((a, b) => a.price.value - b.price.value)
    .reduce((p, order) => [...p, [order.cumulativeShares, order.price.value, order.shares.value]], [])

  return {
    [BIDS]: bids,
    [ASKS]: asks,
  }
})

const getOrderBookKeys = memoize((marketDepth) => {
  const min = marketDepth[BIDS].reduce((p, order, i) => {
    if (i === 0) return order[1]
    return order[1] < p ? order[1] : p
  }, null)

  const mid = () => {
    if (marketDepth[ASKS].length === 0 && marketDepth[BIDS].length === 0) {
      return null
    } else if (marketDepth[ASKS].length === 0 && marketDepth[BIDS].length > 0) {
      return marketDepth[BIDS][0][1]
    } else if (marketDepth[ASKS].length > 0 && marketDepth[BIDS].length === 0) {
      return marketDepth[ASKS][0][1]
    }

    return (marketDepth[ASKS][0][1] + marketDepth[BIDS][0][1]) / 2
  }

  const max = marketDepth[ASKS].reduce((p, order, i) => {
    if (i === 0) return order[1]
    return order[1] > p ? order[1] : p
  }, null)

  return {
    min,
    mid: mid(),
    max,
  }
})

// Mock priceTimeSeries Data
// const now = Date.now()
// const timeDiff = (now - new Date(2017, 8).getTime()) // Can tweak this for more range
// const startTime = now - timeDiff
// const priceTimeSeries = [...new Array(1000000)].map((value, i, array) => ({
//   timestamp: startTime + (i * (timeDiff / array.length)),
//   price: Math.random(),
//   amount: (Math.random() * (10 - 1)) + 1,
// }))

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId)
  const outcome = (market.outcomes || []).find(outcome => outcome.id === ownProps.selectedOutcome) || {}
  const priceTimeSeries = outcome.priceTimeSeries || []
  const cumulativeOrderBook = orderAndAssignCumulativeShares(outcome.orderBook)
  const marketDepth = orderForMarketDepth(cumulativeOrderBook)
  const orderBookKeys = getOrderBookKeys(marketDepth)

  return {
    currentBlock: state.blockchain.currentBlockNumber || 0,
    minPrice: market.minPrice || 0,
    maxPrice: market.maxPrice || 0,
    orderBook: { [BIDS]: [], [ASKS]: [] },
    priceTimeSeries,
    marketDepth: { [BIDS]: [], [ASKS]: [] },
    orderBookKeys,
    hasPriceHistory: priceTimeSeries.length !== 0,
    hasOrders: !isEmpty(cumulativeOrderBook[BIDS]) && !isEmpty(cumulativeOrderBook[ASKS]),
  }
}

export default connect(mapStateToProps)(MarketOutcomeCharts)
