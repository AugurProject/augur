import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketsView from 'modules/markets/components/markets-view'

import getAllMarkets from 'modules/markets/selectors/markets-all'
import { updateMarketsFilteredSorted, clearMarketsFilteredSorted } from 'modules/markets/actions/update-markets-filtered-sorted'

import { toggleFavorite } from 'modules/markets/actions/update-favorites'

import loadMarkets from 'modules/markets/actions/load-markets'
import { loadMarketsByCategory } from 'modules/markets/actions/load-markets-by-category'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'

import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  loginAccount: state.loginAccount,
  markets: getAllMarkets(),
  filteredMarkets: state.marketsFilteredSorted,
  universe: state.universe,
  canLoadMarkets: !!getValue(state, 'universe.id'),
  hasLoadedMarkets: state.hasLoadedMarkets,
  hasLoadedCategory: state.hasLoadedCategory,
  isMobile: state.isMobile,
})

const mapDispatchToProps = dispatch => ({
  loadMarkets: () => dispatch(loadMarkets()),
  loadMarketsByCategory: category => dispatch(loadMarketsByCategory(category)),
  updateMarketsFilteredSorted: filteredMarkets => dispatch(updateMarketsFilteredSorted(filteredMarkets)),
  clearMarketsFilteredSorted: () => dispatch(clearMarketsFilteredSorted()),
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  loadMarketsInfoIfNotLoaded: marketIds => dispatch(loadMarketsInfoIfNotLoaded(marketIds)),
})

const Markets = withRouter(connect(mapStateToProps, mapDispatchToProps)(MarketsView))

export default Markets

// TODO --
// conditionally load the markets missing info
// Populate the categories list
