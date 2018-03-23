import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import BigNumber from 'bignumber.js'

import { selectMarket } from 'modules/market/selectors/market'
import MarketTrading from 'modules/trade/components/trading/trading'
import { clearTradeInProgress } from 'modules/trade/actions/update-trades-in-progress'

const mapStateToProps = state => ({
  availableFunds: new BigNumber(state.loginAccount.eth || 0),
  isLogged: state.isLogged,
  isMobile: state.isMobile,
})

const mapDispatchToProps = dispatch => ({
  clearTradeInProgress: marketId => dispatch(clearTradeInProgress(marketId)),
})

const mergeProps = (sP, dP, oP) => {
  const market = selectMarket(oP.marketId)

  return {
    ...sP,
    ...dP,
    ...oP,
    market,
  }
}

const MarketTradingContainer = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(MarketTrading))

export default MarketTradingContainer
