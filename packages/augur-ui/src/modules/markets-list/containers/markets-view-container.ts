import { AppState } from 'appStore';
import { updateMobileMenuState } from 'modules/app/actions/update-sidebar-status';
import {
  MARKET_CARD_FORMATS,
  MAX_FEE_100_PERCENT,
  MAX_SPREAD_ALL_SPREADS,
} from 'modules/common/constants';
import { handleMarketsUpdatedLog } from 'modules/events/actions/log-handlers';
import {
  MARKET_FILTER,
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  updateFilterSortOptionsSettings,
} from 'modules/filter-sort/actions/update-filter-sort-options';
import { updateLoginAccountSettings } from 'modules/markets-list/actions/update-login-account-settings';

import MarketsView from 'modules/markets-list/components/markets-view';
import {
  loadMarketsByFilter,
  LoadMarketsFilterOptions,
  organizeReportingStates,
} from 'modules/markets/actions/load-markets';
import { loadMarketsInfoIfNotLoaded } from 'modules/markets/actions/load-markets-info';
import { toggleFavorite } from 'modules/markets/actions/update-favorites';
import { getSelectedTagsAndCategoriesFromLocation } from 'modules/markets/helpers/get-selected-tags-and-categories-from-location';
import { buildSearchString } from 'modules/markets/selectors/build-search-string';
import { selectMarkets } from 'modules/markets/selectors/markets-all';
import { NodeStyleCallback } from 'modules/types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { marketListViewed } from 'services/analytics/helpers';
import { augurSdkLite } from 'services/augursdklite';
import { isGoogleBot } from 'utils/is-google-bot';
import {
  setLoadMarketsPending,
  setMarketsListSearchInPlace,
  updateMarketsListCardFormat,
  updateMarketsListMeta,
} from '../actions/update-markets-list';
import { loadMarketsInfo } from 'modules/markets/actions/load-markets-info';

const findMarketsInReportingState = (markets, reportingState) => {
  const reportingStates: String[] = organizeReportingStates(reportingState);
  return markets.filter(market => reportingStates.find(state => state === market.reportingState))
}

const mapStateToProps = (state: AppState, { location }) => {
  const markets = selectMarkets(state);
  const {
    keywords,
    selectedTagNames,
  } = getSelectedTagsAndCategoriesFromLocation(location);

  const searchPhrase = buildSearchString(keywords, selectedTagNames);
  let marketCardFormat = state.marketsList.marketCardFormat
    ? state.marketsList.marketCardFormat
    : state.appStatus.isMobile
    ? MARKET_CARD_FORMATS.COMPACT
    : MARKET_CARD_FORMATS.CLASSIC;

  return {
    isConnected: state.connection.isConnected && state.universe.id != null,
    isLogged: state.authStatus.isLogged,
    restoredAccount: state.authStatus.restoredAccount,
    universe: (state.universe || {}).id,
    search: searchPhrase,
    isMobile: state.appStatus.isMobile,
    markets,
    marketsInReportingState: findMarketsInReportingState(markets, state.filterSortOptions.marketFilter),
    maxFee: state.filterSortOptions.maxFee,
    maxLiquiditySpread: state.filterSortOptions.maxLiquiditySpread,
    isSearching: state.marketsList.isSearching,
    filteredOutCount: state.marketsList.meta
      ? state.marketsList.meta.filteredOutCount
      : 0,
    includeInvalidMarkets: state.filterSortOptions.includeInvalidMarkets,
    selectedCategories: state.marketsList.selectedCategories,
    sortBy: state.filterSortOptions.sortBy,
    marketFilter: state.filterSortOptions.marketFilter,
    marketCardFormat,
    showInvalidMarketsBannerHideOrShow: (state.loginAccount.settings || {})
      .showInvalidMarketsBannerHideOrShow,
    showInvalidMarketsBannerFeesOrLiquiditySpread: (
      state.loginAccount.settings || {}
    ).showInvalidMarketsBannerFeesOrLiquiditySpread,
    templateFilter: state.filterSortOptions.templateFilter,
    marketTypeFilter: state.filterSortOptions.marketTypeFilter,
    marketLimit: state.filterSortOptions.limit,
    marketOffset: state.filterSortOptions.offset,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<void, AppState, Action>
) => ({
  toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
  setLoadMarketsPending: isSearching =>
    dispatch(setLoadMarketsPending(isSearching)),
  updateMarketsListMeta: meta => dispatch(updateMarketsListMeta(meta)),
  loadMarketsInfoIfNotLoaded: marketIds =>
    dispatch(loadMarketsInfoIfNotLoaded(marketIds)),
  loadMarketsByFilter: (
    filter: LoadMarketsFilterOptions,
    cb: NodeStyleCallback
  ) => dispatch(loadMarketsByFilter(filter, cb)),
  removeFeeFilter: () =>
    dispatch(updateFilterSortOptionsSettings({ [MARKET_MAX_FEES]: MAX_FEE_100_PERCENT })),
  removeLiquiditySpreadFilter: () =>
    dispatch(
      updateFilterSortOptionsSettings({ [MARKET_MAX_SPREAD]: MAX_SPREAD_ALL_SPREADS })
    ),
  updateMarketsFilter: filterOption =>
    dispatch(updateFilterSortOptionsSettings({ [MARKET_FILTER]: filterOption })),
  updateMarketsListCardFormat: format =>
    dispatch(updateMarketsListCardFormat(format)),
  updateMobileMenuState: data => dispatch(updateMobileMenuState(data)),
  updateLoginAccountSettings: settings =>
    dispatch(updateLoginAccountSettings(settings)),
  setMarketsListSearchInPlace: isSearchInPlace =>
    dispatch(setMarketsListSearchInPlace(isSearchInPlace)),
  updateFilterSortOptions: filterOptions => dispatch(updateFilterSortOptionsSettings(filterOptions)),
  marketListViewed: (
    search,
    selectedCategories,
    maxLiquiditySpread,
    marketFilter,
    sortBy,
    maxFee,
    templateFilter,
    marketTypeFilter,
    includeInvalidMarkets,
    resultCount,
    pageNumber
  ) =>
    dispatch(
      marketListViewed(
        search,
        selectedCategories,
        maxLiquiditySpread,
        marketFilter,
        sortBy,
        maxFee,
        templateFilter,
        marketTypeFilter,
        includeInvalidMarkets,
        resultCount,
        pageNumber
      )
    ),
  loadMarketsInfo: marketIds => dispatch(loadMarketsInfo(marketIds)),
});

const Markets = withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(MarketsView)
);

export default Markets;
