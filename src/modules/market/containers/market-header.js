import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketHeader from 'modules/market/components/market-header/market-header'

import { selectMarket } from 'modules/market/selectors/market'

import getValue from 'utils/get-value'

const mergeProps = (sP, dP, oP) => {
  const market = selectMarket(oP.marketId)

  return {
    ...oP,
    description: market.description,
    details: market.extraInfo || '',
    resolutionSource: market.resolutionSource,
    coreProperties: {
      volume: getValue(market, 'volume.formatted'),
      fee: getValue(market, 'settlementFeePercent.formatted'), // FIXME -- right now really small fees display as 0.0
      expires: getValue(market, 'endDate.formattedLocal'),
    },
  }
}

const MarketHeaderContainer = withRouter(connect(null, null, mergeProps)(MarketHeader))

export default MarketHeaderContainer
