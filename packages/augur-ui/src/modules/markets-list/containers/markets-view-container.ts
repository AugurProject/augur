import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import MarketsView from "modules/markets-list/components/markets-view";
import { toggleFavorite } from "modules/markets/actions/update-favorites";
import { loadMarketsInfoIfNotLoaded } from "modules/markets/actions/load-markets-info";
import { selectMarkets } from "modules/markets/selectors/markets-all";
import { getSelectedTagsAndCategoriesFromLocation } from "modules/markets/helpers/get-selected-tags-and-categories-from-location";
import { loadMarketsByFilter, LoadMarketsFilterOptions } from "modules/markets/actions/load-markets";
import { buildSearchString } from "modules/markets/selectors/build-search-string";
import debounce from "utils/debounce";
import { AppState } from "store";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import { NodeStyleCallback } from "modules/types";

const mapStateToProps = (state: AppState, { location }) => {
  const markets = selectMarkets(state);
  const {
    selectedCategoryName,
    keywords,
    selectedTagNames,
  } = getSelectedTagsAndCategoriesFromLocation(location);

  const searchPhrase = buildSearchString(keywords, selectedTagNames);

  return {
    isConnected: state.connection.isConnected && state.universe.id != null,
    isLogged: state.authStatus.isLogged,
    universe: (state.universe || {}).id,
    search: searchPhrase,
    isMobile: state.appStatus.isMobile,
    markets,
    category: selectedCategoryName,
    defaultFilter: state.filterSortOptions.marketFilter,
    defaultSort: state.filterSortOptions.marketSort,
    defaultMaxFee: state.filterSortOptions.maxFee,
    defaultHasOrders: state.filterSortOptions.hasOrders,
  };
};



const mapDispatchToProps = (dispatch: ThunkDispatch<void, AppState, Action>) => ({
  toggleFavorite: (marketId) => dispatch(toggleFavorite(marketId)),
  loadMarketsInfoIfNotLoaded: (marketIds) =>
    dispatch(loadMarketsInfoIfNotLoaded((marketIds))),
  loadMarketsByFilter: (filter: LoadMarketsFilterOptions, cb: NodeStyleCallback) =>
    debounce(dispatch(loadMarketsByFilter(filter, cb))),
});

const Markets = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(MarketsView),
);

export default Markets;
