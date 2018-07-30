import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketsView from 'modules/markets/components/markets-view'
import { toggleFavorite } from 'modules/markets/actions/update-favorites'

import loadMarkets from 'modules/markets/actions/load-markets'
import { loadMarketsByCategory } from 'modules/markets/actions/load-markets-by-category'
import { loadMarketsBySearch } from 'modules/markets/actions/load-markets-by-search'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'

import getValue from 'utils/get-value'
import { compose } from 'redux'
import { selectMarkets } from 'src/modules/markets/selectors/markets-all'
import { getSelectedTagsAndCategoriesFromLocation } from 'src/modules/markets/helpers/get-selected-tags-and-categories-from-location'
import { loadMarketsByFilter } from 'modules/markets/actions/load-markets-by-filter'
import { hasLoadedSearchTerm } from 'modules/markets/selectors/has-loaded-search-term'
import debounce from 'utils/debounce'

const mapStateToProps = (state, { location }) => {
  const markets = selectMarkets(state)
  const {
    category,
    keywords,
    tags,
  } = getSelectedTagsAndCategoriesFromLocation(location)

  const searchTermState = hasLoadedSearchTerm(state.hasLoadedSearch, category, keywords, tags)

  return {
    isLogged: state.isLogged,
    loginAccount: state.loginAccount,
    universe: state.universe,
    canLoadMarkets: !!getValue(state, 'universe.id'),
    hasLoadedMarkets: state.hasLoadedMarkets,
    hasLoadedSearch: searchTermState,
    isMobile: state.isMobile,
    markets,
    category,
    tags,
    keywords,
  }
}

const mapDispatchToProps = dispatch => ({
  loadMarkets: type => debounce(dispatch(loadMarkets(type))),
  loadMarketsByCategory: category => debounce(dispatch(loadMarketsByCategory(category))),
  loadMarketsBySearch: (search, type) => debounce(dispatch(loadMarketsBySearch(search, type))),
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  loadMarketsInfoIfNotLoaded: marketIds => dispatch(loadMarketsInfoIfNotLoaded(marketIds)),
  loadMarketsByFilter: (filter, cb) => dispatch(loadMarketsByFilter(filter, cb)),
})

const Markets = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketsView)

export default Markets

// TODO --
// conditionally load the markets missing info
// Populate the categories list
