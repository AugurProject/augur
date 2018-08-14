import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import MarketsView from 'modules/markets/components/markets-view'
import { toggleFavorite } from 'modules/markets/actions/update-favorites'
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info-if-not-loaded'

import { compose } from 'redux'
import { selectMarkets } from 'src/modules/markets/selectors/markets-all'
import { getSelectedTagsAndCategoriesFromLocation } from 'src/modules/markets/helpers/get-selected-tags-and-categories-from-location'
import { loadMarketsByFilter } from 'modules/markets/actions/load-markets-by-filter'
import { buildSearchString } from 'modules/markets/selectors/build-search-string'
import debounce from 'utils/debounce'

const mapStateToProps = (state, { location }) => {
  const markets = selectMarkets(state)
  const {
    category,
    keywords,
    tags,
  } = getSelectedTagsAndCategoriesFromLocation(location)

  const searchPhrase = buildSearchString(keywords, tags)

  return {
    isLogged: state.isLogged,
    universe: (state.universe || {}).id,
    hasLoadedMarkets: state.hasLoadedMarkets,
    search: searchPhrase,
    isMobile: state.isMobile,
    markets,
    category,
    defaultFilter: state.filterOption,
    defaultSort: state.sortOption,
  }
}

const mapDispatchToProps = dispatch => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  loadMarketsInfoIfNotLoaded: marketIds => dispatch(loadMarketsInfoIfNotLoaded(marketIds)),
  loadMarketsByFilter: (filter, cb) => debounce(dispatch(loadMarketsByFilter(filter, cb))),
})

const Markets = compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MarketsView)

export default Markets
