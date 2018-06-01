import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SCALAR } from 'modules/markets/constants/market-types'

import MarketHeader from 'modules/market/components/market-header/market-header'

import { selectMarket } from 'modules/market/selectors/market'

import getValue from 'utils/get-value'

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId)

  return {
    description: market.description || '',
    details: market.details || '',
    marketType: market.marketType,
    resolutionSource: market.resolutionSource,
    reportingFeeRate: getValue(market, 'reportingFeeRate') * 100,
    marketCreatorFeeRate: getValue(market, 'marketCreatorFeeRate') * 100,
    coreProperties: {
      volume: getValue(market, 'volume.full'),
      fee: getValue(market, 'settlementFeePercent.full'),
      expires: getValue(market, 'endTime.formattedLocal'),
      min: market.marketType === SCALAR ? getValue(market, 'minPrice').toString() : null,
      max: market.marketType === SCALAR ? getValue(market, 'maxPrice').toString() : null,
    },
  }
}

const MarketHeaderContainer = withRouter(connect(mapStateToProps)(MarketHeader))

export default MarketHeaderContainer
