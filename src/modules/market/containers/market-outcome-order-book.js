import { connect } from 'react-redux'

import MarketOutcomeOrderbook from 'modules/market/components/market-outcome-order-book/market-outcome-order-book'

const mergeProps = (sP, dP, oP) => {
  // const queryParams = parseQuery(ownProps.location.search)
  // const market = selectMarket(queryParams.id) // NOTE -- commented out for mocking sake
  // const outcome = market.outcomes[selectedOutcome] // NOTE -- this will pull off the respective outcome

  const bids = () => ([...new Array(30)]
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
  )

  const asks = () => ([...new Array(30)]
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
      .sort((a, b) => a.price - b.price)
  )

  const orderBook = {
    bids: bids(),
    asks: asks()
  }

  return {
    ...oP,
    orderBook
  }
}

export default connect(null, null, mergeProps)(MarketOutcomeOrderbook)
