import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketTrading from 'modules/market/components/market-trading/market-trading'

const mapStateToProps = state => ({
  marketID: '0x7d9f26082539a7f9793b8c3b25f2a20374ab357d73ff6d6dc99cab6145b567a0',
  market,
  isLogged: state.isLogged,
})

const MarketTradingContainer = withRouter(connect(mapStateToProps)(MarketTrading))

export default MarketTradingContainer

const market = {
  marketType: "categorical",
  tradeSummary: {
    hasUserEnoughFunds: true,
  },
  submitTrade: () => console.log('submit trade'),
}
