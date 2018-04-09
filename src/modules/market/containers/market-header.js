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
      volume: getValue(market, 'volume.full'),
      fee: getValue(market, 'settlementFeePercent.full'),
      expires: getValue(market, 'endTime.formattedLocal'),
    },
  }
}

const MarketHeaderContainer = withRouter(connect(mapStateToProps)(MarketHeader))

export default MarketHeaderContainer
