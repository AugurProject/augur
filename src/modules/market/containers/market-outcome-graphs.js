import { connect } from 'react-redux'

import MarketOutcomeGraphs from 'modules/market/components/market-outcome-graphs/market-outcome-graphs'

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
  bids: bids.reduce((p, item) => [...p, [item.cumulativeShares, item.price]], []),
  asks: asks.reduce((p, item) => [...p, [item.cumulativeShares, item.price]], []).sort((a, b) => a[0] - b[0]),
}

const marketPriceHistory = [...new Array(30)]
  .map((value, index) => ({
    x: index,
    open: (Math.random()),
    high: (Math.random()),
    low: (Math.random()),
    close: (Math.random()),
    y: (Math.random() * (1000 - 10)) + 10
  }))

const marketMax = marketPriceHistory.reduce((p, item, i) => {
  if (i === 0) return item.high
  return item.high > p ? item.high : p
}, null)
const marketMid = (asks[asks.length - 1].price + bids[0].price) / 2
const marketMin = marketPriceHistory.reduce((p, item, i) => {
  if (i === 0) return item.low
  return item.low < p ? item.low : p
}, null)

// TODO -- wire up to augur-node
const mapStateToProps = state => ({
  marketPriceHistory,
  marketMin,
  marketMid,
  marketMax,
  orderBook: {
    bids,
    asks
  },
  marketDepth
})

export default connect(mapStateToProps)(MarketOutcomeGraphs)
