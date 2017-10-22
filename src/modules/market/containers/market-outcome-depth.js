import { connect } from 'react-redux'

import MarketOutcomeDepth from 'modules/market/components/market-outcome-depth/market-outcome-depth'

const mergeProps = (sP, dP, oP) => {
  // const queryParams = parseQuery(ownProps.location.search)
  // const market = selectMarket(queryParams.id) // NOTE -- commented out for mocking sake
  // const outcome = market.outcomes[selectedOutcome] // NOTE -- this will pull off the respective outcome

  return {}
}

export default connect(null, null, mergeProps)(MarketOutcomeDepth)
