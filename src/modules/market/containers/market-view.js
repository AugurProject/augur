import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import MarketView from 'modules/market/components/market-view/market-view'
import { loadFullMarket } from 'modules/market/actions/load-full-market'
import { selectMarket } from 'modules/market/selectors/market'

import parseQuery from 'modules/routes/helpers/parse-query'

import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names'

const mapStateToProps = (state, ownProps) => {
  const {
    marketsData,
    isLogged,
    connection,
    universe,
    orderBooks,
    isMobile,
  } = state
  const marketId = parseQuery(ownProps.location.search)[MARKET_ID_PARAM_NAME]
  const market = selectMarket(marketId)

  return {
    isConnected: connection.isConnected && universe.id != null,
    marketType: market.marketType,
    description: market.description || '',
    loadingState: market.loadingState || null,
    isLogged,
    universe,
    orderBooks,
    isMobile,
    marketId,
    marketsData,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId)),
})

const Market = withRouter(connect(mapStateToProps, mapDispatchToProps)(MarketView))

export default Market
