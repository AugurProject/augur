import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import MarketsView from 'modules/markets-list/components/markets-view';
import { getMarkets } from 'modules/markets/selectors/markets-all';
import { getSelectedTagsAndCategoriesFromLocation } from 'modules/markets/helpers/get-selected-tags-and-categories-from-location';
import {
  loadMarketsByFilter,
  LoadMarketsFilterOptions,
  organizeReportingStates,
} from 'modules/markets/actions/load-markets';
import { loadMarketOrderBook } from 'modules/orders/helpers/load-market-orderbook';
import { buildSearchString } from 'modules/markets/selectors/build-search-string';
import { AppState } from 'appStore';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { NodeStyleCallback } from 'modules/types';
import {
  MAX_SPREAD_ALL_SPREADS,
  MAX_FEE_100_PERCENT,
  MARKET_CARD_FORMATS,
} from 'modules/common/constants';
import {
  MARKET_FILTER,
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
} from 'modules/app/store/constants';
import { updateLoginAccountSettings } from 'modules/markets-list/actions/update-login-account-settings';
import { marketListViewed } from 'services/analytics/helpers';
import { AppStatus } from 'modules/app/store/app-status';

const findMarketsInReportingState = (markets, reportingState) => {
  const reportingStates: String[] = organizeReportingStates(reportingState);
  return markets.filter(market =>
    reportingStates.find(state => state === market.reportingState)
  );
};

const mapStateToProps = (state: AppState, { location }) => {
  const markets = getMarkets();
  const {
    keywords,
    selectedTagNames,
  } = getSelectedTagsAndCategoriesFromLocation(location);
  const {
    marketsList: { marketCardFormat, isSearching, meta, selectedCategories },
    loginAccount: { settings },
    isMobile,
    universe: { id },
    isConnected,
    filterSortOptions: {
      maxFee,
      marketFilter,
      maxLiquiditySpread,
      marketSort,
      templateFilter,
      includeInvalidMarkets,
    },
  } = AppStatus.get();
  const searchPhrase = buildSearchString(keywords, selectedTagNames);
  const autoSetupMarketCardFormat = marketCardFormat
    ? marketCardFormat
    : isMobile
    ? MARKET_CARD_FORMATS.COMPACT
    : MARKET_CARD_FORMATS.CLASSIC;

  return {
    isConnected: isConnected && id != null,
    universe: id,
    search: searchPhrase,
    markets,
    marketsInReportingState: findMarketsInReportingState(markets, marketFilter),
    maxFee,
    maxLiquiditySpread,
    isSearching,
    filteredOutCount: meta ? meta.filteredOutCount : 0,
    includeInvalidMarkets,
    selectedCategories,
    marketSort,
    marketFilter,
    marketCardFormat: autoSetupMarketCardFormat,
    showInvalidMarketsBannerHideOrShow:
      settings.showInvalidMarketsBannerHideOrShow,
    showInvalidMarketsBannerFeesOrLiquiditySpread:
      settings.showInvalidMarketsBannerFeesOrLiquiditySpread,
    templateFilter,
  };
};

const mapDispatchToProps = (
  dispatch: ThunkDispatch<void, AppState, Action>
) => {
  const { updateFilterSortOptions } = AppStatus.actions;
  return {
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
    updateLoginAccountSettings: settings =>
      dispatch(updateLoginAccountSettings(settings)),
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
  };
};
const Markets = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MarketsView)
);

export default Markets;
