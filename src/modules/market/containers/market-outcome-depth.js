import { connect } from 'react-redux'

import MarketOutcomeDepth from 'modules/market/components/market-outcome-depth/market-outcome-depth'

const mergeProps = (sP, dP, oP) => {
  // const queryParams = parseQuery(ownProps.location.search)
  // const market = selectMarket(queryParams.id) // NOTE -- commented out for mocking sake
  // const outcome = market.outcomes[selectedOutcome] // NOTE -- this will pull off the respective outcome

  const bids = () => ([...new Array(30)]
    .map((value, index) => ([(Math.random() * ((1 - 0.5) + 0.5))]))
    .sort((a, b) => a[0] - b[0])
    .reduce((p, item, i, items) => [...p, [...item, p[i - 1] != null ? p[i - 1][1] + (Math.random() * 100) : 0]], [])
  )

  const asks = () => ([...new Array(30)]
    .map((value, index) => ([(Math.random() * 0.5)]))
    .sort((a, b) => a - b)
    .reduce((p, item, i, items) => [...p, [...item, p[i - 1] != null ? p[i - 1][1] + (Math.random() * 100) : 0]], [])
  )

  return {
    ...oP,
    outcomeDepth: {
      bids: bids(),
      asks: asks()
    }
  }
}

export default connect(null, null, mergeProps)(MarketOutcomeDepth)
