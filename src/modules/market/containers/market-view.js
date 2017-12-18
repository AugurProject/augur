import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import MarketView from 'modules/market/components/market-view/market-view'
import { loadFullMarket } from 'modules/market/actions/load-full-market'

import parseQuery from 'modules/routes/helpers/parse-query'
import getValue from 'utils/get-value'

import { MARKET_ID_PARAM_NAME } from 'modules/routes/constants/param-names'
//
// // import { selectSelectedMarket } from 'modules/market/selectors/market'
// // import { selectMarketsTotals } from 'modules/markets/selectors/markets-totals'
// // import { selectClosePositionStatus } from 'modules/my-positions/selectors/close-position-status'
// // import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination'
// // import getOrderCancellation from 'modules/bids-asks/selectors/order-cancellation'
// //
// // import { updateSelectedMarketID, clearSelectedMarketID } from 'modules/market/actions/update-selected-market-id'
// // import { toggleFavorite } from 'modules/markets/actions/update-favorites'
// //
// // import { MARKET_USER_DATA_NAV_ITEMS } from 'modules/market/constants/market-user-data-nav-items'
// // import { MARKET_DATA_NAV_ITEMS } from 'modules/market/constants/market-data-nav-items'
// // import { OUTCOME_TRADE_NAV_ITEMS } from 'modules/outcomes/constants/outcome-trade-nav-items'
// //
// // import getValue from 'utils/get-value'
//
const mapStateToProps = state => ({
  isLogged: state.isLogged,
  isConnected: state.connection.isConnected,
  universe: state.universe,
  marketsData: state.marketsData
})

const mapDispatchToProps = dispatch => ({
  loadFullMarket: marketId => dispatch(loadFullMarket(marketId)),
})

const mergeProps = (sP, dP, oP) => {
  const marketId = parseQuery(oP.location.search)[MARKET_ID_PARAM_NAME]

  return {
    ...oP,
    marketId,
    isLogged: sP.isLogged,
    isConnected: sP.isConnected && getValue(sP, 'universe.id') != null,
    isMarketLoaded: sP.marketsData[marketId] != null,
    loadFullMarket: () => dP.loadFullMarket(marketId)
  }
}

const Market = withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(MarketView))

export default Market
