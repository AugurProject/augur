import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MarketsView from "modules/markets-list/components/markets-view";
import { toggleFavorite } from "modules/markets/actions/update-favorites";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";

import { compose } from "redux";
import { selectMarkets } from "src/modules/markets/selectors/markets-all";
import { getSelectedTagsAndCategoriesFromLocation } from "src/modules/markets/helpers/get-selected-tags-and-categories-from-location";
import { loadMarketsByFilter } from "modules/markets/actions/load-markets";
import { buildSearchString } from "modules/markets/selectors/build-search-string";
import debounce from "utils/debounce";

const mapStateToProps = (state, { location }) => {
  const markets = selectMarkets(state);
  const {
    selectedCategoryName,
    keywords,
    selectedTagNames
  } = getSelectedTagsAndCategoriesFromLocation(location);

  const searchPhrase = buildSearchString(keywords, selectedTagNames);

  return {
    isLogged: state.authStatus.isLogged,
    universe: (state.universe || {}).id,
    search: searchPhrase,
    isMobile: state.appStatus.isMobile,
    markets,
    category: selectedCategoryName,
    defaultFilter: state.filterSortOptions.marketFilter,
    defaultSort: state.filterSortOptions.marketSort,
    defaultMaxFee: state.filterSortOptions.maxFee,
    defaultHasOrders: state.filterSortOptions.hasOrders
  };
};

const mapDispatchToProps = dispatch => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  loadMarketsInfoIfNotLoaded: marketIds =>
    dispatch(loadMarketsInfoIfNotLoaded(marketIds)),
  loadMarketsByFilter: (filter, cb) =>
    debounce(dispatch(loadMarketsByFilter(filter, cb)))
});

const Markets = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MarketsView);

export default Markets;
