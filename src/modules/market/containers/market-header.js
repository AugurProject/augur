import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketHeader from 'modules/market/components/market-header/market-header'

import { selectMarket } from 'modules/market/selectors/market'

import getValue from 'utils/get-value'

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId)

  return {
    description: market.description || '',
    details: market.extraInfo || '',
    marketType: market.marketType,
    resolutionSource: market.resolutionSource,
    coreProperties: {
      volume: getValue(market, 'volume.formatted'),
      fee: getValue(market, 'settlementFeePercent.formatted'), // FIXME -- right now really small fees display as 0.0
      expires: getValue(market, 'endDate.formattedLocal'),
    },
  }
}

const MarketHeaderContainer = withRouter(connect(mapStateToProps)(MarketHeader))

export default MarketHeaderContainer
