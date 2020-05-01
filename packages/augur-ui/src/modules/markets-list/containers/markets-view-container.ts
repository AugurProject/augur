import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketsView from 'modules/markets-list/components/markets-view';
import { toggleFavorite } from 'modules/markets/actions/update-favorites';
import { selectMarkets } from 'modules/markets/selectors/markets-all';
import { getSelectedTagsAndCategoriesFromLocation } from 'modules/markets/helpers/get-selected-tags-and-categories-from-location';
import {
  loadMarketsByFilter,
  LoadMarketsFilterOptions,
  organizeReportingStates,
} from 'modules/markets/actions/load-markets';
import { loadMarketOrderBook } from 'modules/orders/actions/load-market-orderbook';
import { buildSearchString } from 'modules/markets/selectors/build-search-string';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback } from 'modules/types';
import {
  setLoadMarketsPending,
  updateMarketsListMeta,
  updateMarketsListCardFormat,
  setMarketsListSearchInPlace,
} from '../actions/update-markets-list';
import {
  MAX_SPREAD_ALL_SPREADS,
  MAX_FEE_100_PERCENT,
} from 'modules/common/constants';
import {
  MARKET_FILTER,
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
} from 'modules/app/store/constants';
import { updateLoginAccountSettings } from 'modules/markets-list/actions/update-login-account-settings';
import { marketListViewed } from 'services/analytics/helpers';
import { AppStatusState, AppStatusActions } from 'modules/app/store/app-status';

const findMarketsInReportingState = (markets, reportingState) => {
  const reportingStates: String[] = organizeReportingStates(reportingState);
  return markets.filter(market =>
    reportingStates.find(state => state === market.reportingState)
  );
};

const mapStateToProps = (state: AppState, { location }) => {
  const markets = selectMarkets(state);
  const {
    keywords,
    selectedTagNames,
  } = getSelectedTagsAndCategoriesFromLocation(location);
  const {
    isConnected,
    filterSortOptions: {
      maxFee,
      marketFilter,
      maxLiquiditySpread,
      marketSort,
      templateFilter,
      includeInvalidMarkets,
    },
  } = AppStatusState.get();
  const searchPhrase = buildSearchString(keywords, selectedTagNames);

  return {
    isConnected: isConnected && state.universe.id != null,
    universe: (state.universe || {}).id,
    search: searchPhrase,
    markets,
    marketsInReportingState: findMarketsInReportingState(markets, marketFilter),
    maxFee,
    maxLiquiditySpread,
    isSearching: state.marketsList.isSearching,
    filteredOutCount: state.marketsList.meta
      ? state.marketsList.meta.filteredOutCount
      : 0,
    includeInvalidMarkets,
    selectedCategories: state.marketsList.selectedCategories,
    marketSort,
    marketFilter,
    marketCardFormat: state.marketsList.marketCardFormat,
    showInvalidMarketsBannerHideOrShow: (state.loginAccount.settings || {})
      .showInvalidMarketsBannerHideOrShow,
    showInvalidMarketsBannerFeesOrLiquiditySpread: (
      state.loginAccount.settings || {}
    ).showInvalidMarketsBannerFeesOrLiquiditySpread,
    templateFilter,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<void, AppState, Action>
) => {
  const { updateFilterSortOptions } = AppStatusActions.actions;
  return ({
    toggleFavorite: marketId => dispatch(toggleFavorite(marketId)),
    setLoadMarketsPending: isSearching =>
      dispatch(setLoadMarketsPending(isSearching)),
    updateMarketsListMeta: meta => dispatch(updateMarketsListMeta(meta)),
    loadMarketsByFilter: (
      filter: LoadMarketsFilterOptions,
      cb: NodeStyleCallback
    ) => dispatch(loadMarketsByFilter(filter, cb)),
    loadMarketOrderBook: marketId => dispatch(loadMarketOrderBook(marketId)),
    removeFeeFilter: () =>
      updateFilterSortOptions({ [MARKET_MAX_FEES]: MAX_FEE_100_PERCENT }),
    removeLiquiditySpreadFilter: () =>
      updateFilterSortOptions({ [MARKET_MAX_SPREAD]: MAX_SPREAD_ALL_SPREADS }),
    updateMarketsFilter: filterOption =>
      updateFilterSortOptions({ [MARKET_FILTER]: filterOption }),
    updateMarketsListCardFormat: format =>
      dispatch(updateMarketsListCardFormat(format)),
    updateLoginAccountSettings: settings =>
      dispatch(updateLoginAccountSettings(settings)),
    setMarketsListSearchInPlace: isSearchInPlace =>
      dispatch(setMarketsListSearchInPlace(isSearchInPlace)),
    marketListViewed: (
      search,
      selectedCategories,
      maxLiquiditySpread,
      marketFilter,
      marketSort,
      maxFee,
      templateFilter,
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
          marketSort,
          maxFee,
          templateFilter,
          includeInvalidMarkets,
          resultCount,
          pageNumber
        )
      ),
  });
}
const Markets = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MarketsView)
);

export default Markets;
