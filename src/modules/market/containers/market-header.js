import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketHeader from 'modules/market/components/market-header/market-header'

// import { selectMarket } from 'modules/market/selectors/market'

// import parseQuery from 'modules/routes/helpers/parse-query'

import getValue from 'utils/get-value'

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  // const queryParams = parseQuery(ownProps.location.search)
  // const market = selectMarket(queryParams.id) // NOTE -- commented out for mocking sake
  const market = { // NOTE -- mocked until we have market getters wired up
    id: '0',
    description: 'This is just a test market yo',
    extraInfo: 'This is the extra info for the market',
    volume: {
      formatted: '84k shares'
    },
    settlementFeePercent: {
      formatted: '2.8%'
    },
    endDate: {
      formattedLocal: '6/9/17 7:00 AM PST'
    }
  }

  return {
    ...ownProps,
    description: market.description,
    details: market.extraInfo,
    coreProperties: {
      volume: getValue(market, 'volume.formatted'),
      fee: getValue(market, 'settlementFeePercent.formatted'),
      expires: getValue(market, 'endDate.formattedLocal')
    }
  }
}

const MarketHeaderContainer = withRouter(connect(null, null, mergeProps)(MarketHeader))

export default MarketHeaderContainer
