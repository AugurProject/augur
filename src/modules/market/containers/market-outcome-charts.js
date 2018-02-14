import { connect } from 'react-redux'
import memoize from 'memoizee'

import MarketOutcomeCharts from 'modules/market/components/market-outcome-charts/market-outcome-charts'

import { BIDS, ASKS } from 'modules/order-book/constants/order-book-order-types'

import { selectMarket } from 'modules/market/selectors/market'
import { isEmpty } from 'lodash'

// const bids = [...new Array(30)]
//   .map((value, index) => ([Math.random() * 0.5, Math.random() * 100]))
//   .sort((a, b) => b[0] - a[0])
//   .reduce((p, item, i, items) => {
//     const shares = (Math.random() * 100)
//     return [
//       ...p,
//       {
//         price: item[0],
//         shares,
//         cumulativeShares: p[i - 1] != null ? p[i - 1].cumulativeShares + shares : 0
//       }
//     ]
//   }, [])
//
// const asks = [...new Array(30)]
//   .map((value, index) => ([(Math.random() * (1 - 0.5)) + 0.5, Math.random() * 100]))
//   .sort((a, b) => a[0] - b[0])
//   .reduce((p, item, i, items) => {
//     const shares = (Math.random() * 100)
//     return [
//       ...p,
//       {
//         price: item[0],
//         shares,
//         cumulativeShares: p[i - 1] != null ? p[i - 1].cumulativeShares + shares : 0
//       }
//     ]
//   }, [])
//   .sort((a, b) => b.price - a.price)

// const marketDepth = {
//   bids: bids.reduce((p, item) => [...p, [item.cumulativeShares, item.price, item.shares]], []),
//   asks: asks.reduce((p, item) => [...p, [item.cumulativeShares, item.price, item.shares]], []).sort((a, b) => a[0] - b[0]),
// }

const startTime = new Date().getTime()

const marketPriceHistory = [...new Array(30)]
  .map((value, index) => ({
    period: startTime + (index * ((1000000000000 - 0) + 0)),
    high: (Math.random()),
    low: (Math.random()),
    open: (Math.random()),
    close: (Math.random()),
    volume: (Math.random() * (1000 - 10)) + 10
  }))
  .sort((a, b) => a.x - b.x)

// Object.keys(marketDepth).reduce((p, side) => [...p, ...marketDepth[side].reduce((p, item) => [...p, item[0]], [])], [])

// const orderBookMin = marketDepth.bids.reduce((p, item, i) => {
//   if (i === 0) return item[1]
//   return item[1] < p ? item[1] : p
// }, null)
// const orderBookMid = (asks[asks.length - 1].price + bids[0].price) / 2
// const orderBookMax = marketDepth.asks.reduce((p, item, i) => {
//   if (i === 0) return item[1]
//   return item[1] > p ? item[1] : p
// }, null)

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId)
  const outcome = market.outcomes.find(outcome => outcome.id === ownProps.selectedOutcome) || {}
  const orderBook = orderAndAssignCumulativeShares(outcome.orderBook)
  const marketDepth = orderForMarketDepth(orderBook)
  const orderBookKeys = getOrderBookKeys(marketDepth) // min, mid, max

  return {
    marketPriceHistory,
    minPrice: market.minPrice,
    maxPrice: market.maxPrice,
    outcomeBounds: findBounds(outcome),
    orderBook,
    marketDepth,
    orderBookKeys
  }
}

export default connect(mapStateToProps)(MarketOutcomeCharts)

// outcome specific trading price range
const findBounds = memoize((outcome = {}) => {
  const DEFAULT_BOUNDS = {
    min: null,
    max: null
  }

  if (isEmpty(outcome)) return DEFAULT_BOUNDS

  return (outcome.priceTimeSeries || []).reduce((p, item, i) => {
    const currentItem = item[1]

    if (i === 0) {
      return {
        min: currentItem,
        max: currentItem
      }
    }

    return {
      min: currentItem < p.min ? currentItem : p.min,
      max: currentItem > p.max ? currentItem : p.max
    }
  }, DEFAULT_BOUNDS)
})

const orderAndAssignCumulativeShares = memoize((orderBook) => {
  const bids = (orderBook[BIDS] || [])
    .sort((a, b) => b.price.value - a.price.value)
    .reduce((p, order, i, orders) => [
      ...p,
      {
        price: order.price,
        shares: order.shares,
        cumulativeShares: p[i - 1] != null ? p[i - 1].cumulativeShares + order.shares.value : 0
      }
    ], [])

  const asks = (orderBook[ASKS] || [])
    .sort((a, b) => a[0] - b[0])
    .reduce((p, order, i, orders) => [
      ...p,
      {
        price: order.price,
        shares: order.shares,
        cumulativeShares: p[i - 1] != null ? p[i - 1].cumulativeShares + order.shares.value : 0
      }
    ], [])
    .sort((a, b) => b.price.value - a.price.value)

  return {
    bids,
    asks
  }
})

const orderForMarketDepth = memoize((orderBook) => {
  const bids = (orderBook[BIDS] || []).reduce((p, order) => [...p, [order.cumulativeShares, order.price.value, order.shares.value]], [])
  const asks = (orderBook[ASKS] || []).reduce((p, order) => [...p, [order.cumulativeShares, order.price.value, order.shares.value]], []).sort((a, b) => a[0] - b[0])

  return {
    [BIDS]: bids,
    [ASKS]: asks
  }
})

const getOrderBookKeys = memoize((marketDepth) => {
  const min = marketDepth[BIDS].reduce((p, order, i) => {
    if (i === 0) return order[1]
    return order[1] < p ? order[1] : p
  }, null)

  const mid = marketDepth[ASKS].length > 0 ? (marketDepth[ASKS][marketDepth[ASKS].length - 1][1] + marketDepth[BIDS][0][1]) / 2 : null

  const max = marketDepth[BIDS].reduce((p, order, i) => {
    if (i === 0) return order[1]
    return order[1] > p ? order[1] : p
  }, null)

  return {
    min,
    mid,
    max
  }
})
