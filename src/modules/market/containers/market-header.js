import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { SCALAR } from 'modules/markets/constants/market-types'

import MarketHeader from 'modules/market/components/market-header/market-header'
import { ZERO } from 'modules/trade/constants/numbers'
import { selectMarket } from 'modules/market/selectors/market'
import { dateHasPassed } from 'utils/format-date'
import { selectCurrentTimestamp } from 'src/select-state'

import getValue from 'utils/get-value'

const mapStateToProps = (state, ownProps) => {
  const market = selectMarket(ownProps.marketId)

  const coreProperties = {
    volume: {
      value: getValue(market, 'volume.full'),
    },
    fee: {
      value: getValue(market, 'settlementFeePercent.full'),
      tooltipHeader: 'Trading Settlement Fee',
      marketCreatorFee: getValue(market, 'marketCreatorFeeRatePercent.full'),
      reportingFee: getValue(market, 'reportingFeeRatePercent.full'),
      tooltip: true,
    },
    expires: {
      value: dateHasPassed(selectCurrentTimestamp(state), getValue(market, 'endTime.timestamp')) ? null : getValue(market, 'endTime.formattedLocal'),
    },
    expired: {
      value: !dateHasPassed(selectCurrentTimestamp(state), getValue(market, 'endTime.timestamp')) ? null : getValue(market, 'endTime.formattedLocal'),
    },
    min: {
      value: market.marketType === SCALAR ? getValue(market, 'minPrice').toString() : null,
    },
    max: {
      value: market.marketType === SCALAR ? getValue(market, 'maxPrice').toString() : null,
    },
  }

  return {
    description: market.description || '',
    details: market.details || '',
    marketType: market.marketType,
    maxPrice: market.maxPrice || ZERO,
    minPrice: market.minPrice || ZERO,
    scalarDenomination: market.scalarDenomination,
    resolutionSource: market.resolutionSource,
    coreProperties,
  }
}

const MarketHeaderContainer = withRouter(connect(mapStateToProps)(MarketHeader))

export default MarketHeaderContainer
