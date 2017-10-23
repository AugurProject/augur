import { connect } from 'react-redux'

import MarketOutcomeCandlestick from 'modules/market/components/market-outcome-candlestick/market-outcome-candlestick'

const mergeProps = (sP, dP, oP) => {
  // const queryParams = parseQuery(ownProps.location.search)
  // const market = selectMarket(queryParams.id) // NOTE -- commented out for mocking sake
  // const outcome = market.outcomes[selectedOutcome] // NOTE -- this will pull off the respective outcome

  const randomData = () => [...new Array(30)].map((value, index) => ([
    index,
    (Math.random() * 1),
    (Math.random() * 1),
    (Math.random() * 1),
    (Math.random() * 1)
  ]))

  // [period start, open, high, low, close]
  return {
    ...oP,
    outcomeCandlestick: randomData()
  }
}

export default connect(null, null, mergeProps)(MarketOutcomeCandlestick)
