import { connect } from 'react-redux'

import MarketOutcomeOrderbook from 'modules/market/components/market-outcome-order-book/market-outcome-order-book'

const mergeProps = (sP, dP, oP) => {
  // const queryParams = parseQuery(ownProps.location.search)
  // const market = selectMarket(queryParams.id) // NOTE -- commented out for mocking sake
  // const outcome = market.outcomes[selectedOutcome] // NOTE -- this will pull off the respective outcome

  return {
    ...oP
  }
}

export default connect(null, null, mergeProps)(MarketOutcomeOrderbook)
