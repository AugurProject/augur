import { connect } from 'react-redux'

import MarketOutcomeDepth from 'modules/market/components/market-outcome-depth/market-outcome-depth'

const mergeProps = (sP, dP, oP) => {
  // const queryParams = parseQuery(ownProps.location.search)
  // const market = selectMarket(queryParams.id) // NOTE -- commented out for mocking sake
  // const outcome = market.outcomes[selectedOutcome] // NOTE -- this will pull off the respective outcome

  const bids = () => ([...new Array(30)]
    .map((value, index) => ([(Math.random() * (1 - 0.5)) + 0.5]))
    .sort((a, b) => a[0] - b[0])
    .reduce((p, item, i, items) => [...p, [p[i - 1] != null ? p[i - 1][0] + (Math.random() * 100) : 0, item[0]]], [])
  )

  const asks = () => ([...new Array(30)]
    .map((value, index) => ([Math.random() * 0.5]))
    .sort((a, b) => b[0] - a[0])
    .reduce((p, item, i, items) => [...p, [p[i - 1] != null ? p[i - 1][0] + (Math.random() * 100) : 0, item[0]]], [])
  )

  console.log('bids -- ', bids(), asks())

  return {
    ...oP,
    outcomeDepth: {
      bids: bids(),
      asks: asks()
    }
  }
}

export default connect(null, null, mergeProps)(MarketOutcomeDepth)
