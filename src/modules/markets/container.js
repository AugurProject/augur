import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketsView from 'modules/markets/components/markets-view'

import getAllMarkets from 'modules/markets/selectors/markets-all'
import getScalarShareDenomination from 'modules/market/selectors/scalar-share-denomination'
import { updateMarketsFilteredSorted, clearMarketsFilteredSorted } from 'modules/markets/actions/update-markets-filtered-sorted'

import { toggleFavorite } from 'modules/markets/actions/update-favorites'

import loadMarkets from 'modules/markets/actions/load-markets'
import { loadMarketsByTopic } from 'modules/markets/actions/load-markets-by-topic'
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info'

import getValue from 'utils/get-value'

const mapStateToProps = state => ({
  isLogged: state.isLogged,
  loginAccount: state.loginAccount,
  markets: getAllMarkets(),
  filteredMarkets: state.marketsFilteredSorted,
  universe: state.universe,
  canLoadMarkets: !!getValue(state, 'universe.id'),
  scalarShareDenomination: getScalarShareDenomination(),
  hasLoadedMarkets: state.hasLoadedMarkets,
  hasLoadedTopic: state.hasLoadedTopic
})

const mapDispatchToProps = dispatch => ({
  loadMarkets: () => dispatch(loadMarkets()),
  loadMarketsByTopic: topic => dispatch(loadMarketsByTopic(topic)),
  updateMarketsFilteredSorted: filteredMarkets => dispatch(updateMarketsFilteredSorted(filteredMarkets)),
  clearMarketsFilteredSorted: () => dispatch(clearMarketsFilteredSorted()),
  toggleFavorite: marketID => dispatch(toggleFavorite(marketID)),
  loadMarketsInfo: marketIDs => dispatch(loadMarketsInfo(marketIDs))
})

const Markets = withRouter(connect(mapStateToProps, mapDispatchToProps)(MarketsView))

export default Markets

// TODO --
// conditionally load the markets missing info
// Populate the categories list
