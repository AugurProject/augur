import { connect } from 'react-redux'

import MarketOutcomesChart from 'modules/market/components/market-outcomes-chart/market-outcomes-chart'

import { selectMarket } from 'modules/market/selectors/market'

const mapStateToProps = (state, ownProps) => ({
  outcomes: selectMarket(ownProps.marketId).outcomes || [],
  marketPriceHistory: state.priceHistory[ownProps.marketId] || {}
})

export default connect(mapStateToProps)(MarketOutcomesChart)
