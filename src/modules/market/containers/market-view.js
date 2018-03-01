import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import MarketView from 'modules/market/components/market-view/market-view'
import { loadFullMarket } from 'modules/market/actions/load-full-market'

import parseQuery from 'modules/routes/helpers/parse-query'
import getValue from 'utils/get-value'

import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  isConnected: state.connection.isConnected,
  universe: state.universe,
  marketsData: state.marketsData,
  orderBooks: state.orderBooks,
  isMobile: state.isMobile,
})

const mapDispatchToProps = dispatch => ({
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId)),
})

const mergeProps = (sP, dP, oP) => {
  const marketId = parseQuery(oP.location.search)[MARKET_ID_PARAM_NAME]
  const isMarketLoaded = ((sP.marketsData[marketId] != null) && (sP.orderBooks[marketId] !== undefined))

  return {
    ...oP,
    marketId,
    marketType: isMarketLoaded ? sP.marketsData[marketId].marketType : null,
    isLogged: sP.isLogged,
    isConnected: sP.isConnected && getValue(sP, 'universe.id') != null,
    isMarketLoaded,
    loadFullMarket: () => dP.loadFullMarket(marketId),
  }
}

const Market = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(MarketView))

export default Market

//
// // import { selectSelectedMarket } from 'modules/market/selectors/market'
// // import { selectMarketsTotals } from 'modules/markets/selectors/markets-totals'
// // import { selectClosePositionStatus } from 'modules/my-positions/selectors/close-position-status'
// // import getOrderCancellation from 'modules/bids-asks/selectors/order-cancellation'
// //
// // import { updateSelectedMarketId, clearSelectedMarketId } from 'modules/market/actions/update-selected-market-id'
// // import { toggleFavorite } from 'modules/markets/actions/update-favorites'
// //
// // import { MARKET_USER_DATA_NAV_ITEMS } from 'modules/market/constants/market-user-data-nav-items'
// // import { MARKET_DATA_NAV_ITEMS } from 'modules/market/constants/market-data-nav-items'
// // import { OUTCOME_TRADE_NAV_ITEMS } from 'modules/outcomes/constants/outcome-trade-nav-items'
// //
// // import getValue from 'utils/get-value'
//
