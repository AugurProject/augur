import { connect } from 'react-redux'

import MarketOutcomesChart from 'modules/market/components/market-outcomes-chart/market-outcomes-chart'

import { selectMarket } from 'modules/market/selectors/market'

const mapStateToProps = (state, ownProps) => ({
  priceTimeSeries: selectMarket(ownProps.marketId).priceTimeSeries || []
})

export default connect(mapStateToProps)(MarketOutcomesChart)
