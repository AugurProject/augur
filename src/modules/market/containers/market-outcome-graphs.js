import { connect } from 'react-redux'

import MarketOutcomeGraphs from 'modules/market/components/market-outcome-graphs/market-outcome-graphs'

const marketPriceHistory = [...new Array(30)]
  .map((value, index) => ({
    x: index,
    open: (Math.random()),
    high: (Math.random()),
    low: (Math.random()),
    close: (Math.random()),
    y: (Math.random() * ((1000 - 10) + 10))
  }))

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

const marketMidpoint = (asks[asks.length - 1].price + bids[0].price) / 2 // Make selector
const marketDepth = {
  bids: bids.reduce((p, item) => [...p, [item.cumulativeShares, item.price]], []),
  asks: asks.reduce((p, item) => [...p, [item.cumulativeShares, item.price]], []).sort((a, b) => a[0] - b[0]),
}

// TODO -- wire up to augur-node
const mapStateToProps = state => ({
  marketPriceHistory,
  marketMidpoint,
  orderBook: {
    bids,
    asks
  },
  marketDepth
})

export default connect(mapStateToProps)(MarketOutcomeGraphs)
