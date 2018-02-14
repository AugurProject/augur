import { connect } from 'react-redux'
import memoize from 'memoizee'

import MarketOutcomeCharts from 'modules/market/components/market-outcome-charts/market-outcome-charts'

import { selectMarket } from 'modules/market/selectors/market'

const bids = [...new Array(30)]
  .map((value, index) => ([Math.random() * 0.5, Math.random() * 100]))
  .sort((a, b) => b[0] - a[0])
  .reduce((p, item, i, items) => {
    const shares = (Math.random() * 100)
    return [
      ...p,
      {
        price: item[0],
        shares,
        cumulativeShares: p[i - 1] != null ? p[i - 1].cumulativeShares + shares : 0
      }
    ]
  }, [])

const asks = [...new Array(30)]
  .map((value, index) => ([(Math.random() * (1 - 0.5)) + 0.5, Math.random() * 100]))
  .sort((a, b) => a[0] - b[0])
  .reduce((p, item, i, items) => {
    const shares = (Math.random() * 100)
    return [
      ...p,
      {
        price: item[0],
        shares,
        cumulativeShares: p[i - 1] != null ? p[i - 1].cumulativeShares + shares : 0
      }
    ]
  }, [])
  .sort((a, b) => b.price - a.price)

const marketDepth = {
  bids: bids.reduce((p, item) => [...p, [item.cumulativeShares, item.price, item.shares]], []),
  asks: asks.reduce((p, item) => [...p, [item.cumulativeShares, item.price, item.shares]], []).sort((a, b) => a[0] - b[0]),
}

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

Object.keys(marketDepth).reduce((p, side) => [...p, ...marketDepth[side].reduce((p, item) => [...p, item[0]], [])], [])

const orderBookMin = marketDepth.bids.reduce((p, item, i) => {
  if (i === 0) return item[1]
  return item[1] < p ? item[1] : p
}, null)
const orderBookMid = (asks[asks.length - 1].price + bids[0].price) / 2
const orderBookMax = marketDepth.asks.reduce((p, item, i) => {
  if (i === 0) return item[1]
  return item[1] > p ? item[1] : p
}, null)

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId)

  return {
    marketPriceHistory,
    minPrice: market.minPrice,
    maxPrice: market.maxPrice,
    outcomeBounds: findBounds(market.outcomes, ownProps.selectedOutcome),
    orderBookMin,
    orderBookMid,
    orderBookMax,
    orderBook: {
      bids,
      asks
    },
    marketDepth
  }
}

export default connect(mapStateToProps)(MarketOutcomeCharts)

// outcome specific trading price range
const findBounds = memoize((outcomes = [], selectedOutcome = null) => {
  if (
    outcomes.length === 0 ||
    selectedOutcome == null
  ) {
    return null
  }

  const outcome = outcomes.find(outcome => outcome.id === selectedOutcome) || {}

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
  }, {
    min: null,
    max: null
  })
})
