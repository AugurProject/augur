import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketsView from 'modules/markets/components/markets-view'

import { identity, filter, map } from 'lodash/fp'

import { toggleFavorite } from 'modules/markets/actions/update-favorites'

import loadMarkets from 'modules/markets/actions/load-markets'
import { loadMarketsByCategory } from 'modules/markets/actions/load-markets-by-category'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'

import getValue from 'utils/get-value'
import { compose } from 'redux'
import { selectMarkets } from 'src/modules/markets/selectors/markets-all'
import { getSelectedTagsAndCategoriesFromLocation } from 'src/modules/markets/helpers/get-selected-tags-and-categories-from-location'
import { filterArrayByArrayPredicate } from 'src/modules/filter-sort/helpers/filter-array-of-objects-by-array'
import { filterBySearch } from 'src/modules/filter-sort/helpers/filter-by-search'
import { FILTER_SEARCH_KEYS } from 'src/modules/markets/constants/filter-sort'

const mapStateToProps = (state, { location }) => {
  const markets = selectMarkets(state)
  const {
    category,
    keywords,
    tags,
  } = getSelectedTagsAndCategoriesFromLocation(location)

  const categoryFilter = category ? filter(m => (m.category || '').toLowerCase() === category.toLowerCase()) : identity

  // The filterBySearch function returns ids not objects.
  const keywordFilter = keywords ? filterBySearch(keywords, FILTER_SEARCH_KEYS) : map('id')
  const tagFilterPredicate = filterArrayByArrayPredicate('tags', tags)

  // filter by category
  const filteredMarkets = compose(
    keywordFilter,
    filter(tagFilterPredicate),
    categoryFilter,
  )(markets)

  return {
    isLogged: state.isLogged,
    loginAccount: state.loginAccount,
    filteredMarkets,
    universe: state.universe,
    canLoadMarkets: !!getValue(state, 'universe.id'),
    hasLoadedMarkets: state.hasLoadedMarkets,
    hasLoadedCategory: state.hasLoadedCategory,
    isMobile: state.isMobile,
    markets,
    category,
    tags,
  }
}

const mapDispatchToProps = dispatch => ({
  loadMarkets: () => dispatch(loadMarkets()),
  loadMarketsByCategory: category => dispatch(loadMarketsByCategory(category)),
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  loadMarketsInfoIfNotLoaded: marketIds => dispatch(loadMarketsInfoIfNotLoaded(marketIds)),
})

const Markets = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketsView)

export default Markets

// TODO --
// conditionally load the markets missing info
// Populate the categories list
