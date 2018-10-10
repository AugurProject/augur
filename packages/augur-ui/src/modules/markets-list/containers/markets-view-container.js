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
import { loadDisputing } from "modules/reports/actions/load-disputing";

const mapStateToProps = (state, { location }) => {
  const markets = selectMarkets(state);
  const { category, keywords, tags } = getSelectedTagsAndCategoriesFromLocation(
    location
  );

  const searchPhrase = buildSearchString(keywords, tags);

  return {
    isLogged: state.authStatus.isLogged,
    universe: (state.universe || {}).id,
    hasLoadedMarkets: state.appStatus.hasLoadedMarkets,
    search: searchPhrase,
    isMobile: state.appStatus.isMobile,
    markets,
    category,
    defaultFilter: state.filterSortOptions.marketFilter,
    defaultSort: state.filterSortOptions.marketSort
  };
};

const mapDispatchToProps = dispatch => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  loadMarketsInfoIfNotLoaded: marketIds =>
    dispatch(loadMarketsInfoIfNotLoaded(marketIds)),
  loadMarketsByFilter: (filter, cb) =>
    debounce(dispatch(loadMarketsByFilter(filter, cb))),
  loadDisputing: () => dispatch(loadDisputing())
});

const Markets = compose(
  withRouter,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MarketsView);

export default Markets;
