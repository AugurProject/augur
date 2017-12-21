import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketHeader from 'modules/market/components/market-header/market-header'

import { selectMarket } from 'modules/market/selectors/market'

import parseQuery from 'modules/routes/helpers/parse-query'

import getValue from 'utils/get-value'

const mergeProps = (sP, dP, oP) => {
  const queryParams = parseQuery(oP.location.search)
  const market = selectMarket(queryParams.id)

  return {
    ...oP,
    description: market.description,
    details: market.extraInfo,
    coreProperties: {
      volume: getValue(market, 'volume.formatted'),
      fee: getValue(market, 'settlementFeePercent.formatted'), // FIXME -- right now really small fees display as 0.0
      expires: getValue(market, 'endDate.formattedLocal')
    }
  }
}

const MarketHeaderContainer = withRouter(connect(null, null, mergeProps)(MarketHeader))

export default MarketHeaderContainer
