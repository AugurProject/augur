import { connect } from 'react-redux'

import MarketOutcomeCandlestick from 'modules/market/components/market-outcome-candlestick/market-outcome-candlestick'

const mergeProps = (sP, dP, oP) => {
  // const queryParams = parseQuery(ownProps.location.search)
  // const market = selectMarket(queryParams.id) // NOTE -- commented out for mocking sake
  // const outcome = market.outcomes[selectedOutcome] // NOTE -- this will pull off the respective outcome
}

export default connect(null, null, mergeProps)(MarketOutcomeCandlestick)
