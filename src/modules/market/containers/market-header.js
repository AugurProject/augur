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
    coreProperties: {
      volume: {
        value: getValue(market, 'volume.full'),
      },
      fee: {
        value: getValue(market, 'settlementFeePercent.full'),
        tooltip: 'Market Creator Fee (' + getValue(market, 'marketCreatorFeeRatePercent.full') + ') + Reporting Fee (' + getValue(market, 'reportingFeeRatePercent.full') + ')',
      },
      expires: {
        value: getValue(market, 'endTime.formattedLocal'),
      },
      min: {
        value: market.marketType === SCALAR ? getValue(market, 'minPrice').toString() : null,
      },
      max: {
        value: market.marketType === SCALAR ? getValue(market, 'maxPrice').toString() : null,
      },
    },
  }
}

const MarketHeaderContainer = withRouter(connect(mapStateToProps)(MarketHeader))

export default MarketHeaderContainer
