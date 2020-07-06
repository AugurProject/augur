import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';
import MarketsHeader from 'modules/markets-list/components/markets-header';
import {
  MarketsList,
  determineSportsbookType,
  groupSportsMarkets,
} from 'modules/markets-list/components/markets-list';
import Styles from 'modules/markets-list/components/markets-view.styles.less';
import { FilterTags } from 'modules/common/filter-tags';
import { FilterNotice } from 'modules/common/filter-notice';
import FilterDropDowns from 'modules/filter-sort/filter-dropdowns';
import MarketTypeFilter from 'modules/filter-sort/market-type-filter';
import MarketCardFormatSwitcher from 'modules/filter-sort/market-card-format-switcher';
import updateQuery from 'modules/routes/helpers/update-query';
import {
  HELP_CENTER_INVALID_MARKETS,
  THEMES,
  CATEGORY_PARAM_NAME,
  MARKET_CARD_FORMATS,
  SPORTS_GROUP_TYPES,
} from 'modules/common/constants';
import { Getters } from '@augurproject/sdk';
import classNames from 'classnames';
import { LandingHero } from 'modules/markets-list/components/landing-hero';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { MARKETS_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import FilterSearch from 'modules/filter-sort/filter-search';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { FilterButton } from 'modules/common/buttons';
import parseQuery from 'modules/routes/helpers/parse-query';
import { useMarketsStore } from 'modules/markets/store/markets';
import { loadMarketOrderBook } from 'modules/orders/helpers/load-market-orderbook';
import { getMarkets } from 'modules/markets/selectors/markets-all';
import { getSelectedTagsAndCategoriesFromLocation } from 'modules/markets/helpers/get-selected-tags-and-categories-from-location';
import { buildSearchString } from 'modules/markets/selectors/build-search-string';
import {
  organizeReportingStates,
  loadMarketsByFilter,
} from 'modules/markets/actions/load-markets';
import {
  MARKET_MAX_FEES,
  MARKET_MAX_SPREAD,
  MARKET_FILTER,
  MAX_FEE_100_PERCENT,
  MAX_SPREAD_ALL_SPREADS,
} from 'modules/app/store/constants';
import { updateLoginAccountSettings } from '../actions/update-login-account-settings';
import { marketListViewed } from 'services/analytics/helpers';

const PAGINATION_COUNT = 10;

const findMarketsInReportingState = (markets, reportingState) => {
  const reportingStates: String[] = organizeReportingStates(reportingState);
  return markets.filter((market) =>
    reportingStates.find((state) => state === market.reportingState)
  );
};

const getHeaderTitleFromProps = (
  search: string,
  location: Location,
  selectedCategory: string[]
) => {
  if (search) {
    if (search.endsWith('*')) {
      search = search.slice(0, -1);
    }
    return `Search: "${search}"`;
  }

  const searchParams = parseQuery(location.search);

  if (searchParams[CATEGORY_PARAM_NAME]) {
    return searchParams[CATEGORY_PARAM_NAME];
  }

  if (selectedCategory && selectedCategory.length > 0) {
    return selectedCategory[selectedCategory.length - 1];
  }

  return 'Popular markets';
};

const MarketsView = () => {
  const location = useLocation();
  const history = useHistory();
  const markets = getMarkets();
  const {
    keywords,
    selectedTagNames,
  } = getSelectedTagsAndCategoriesFromLocation(location);
  const {
    marketsList: { isSearching, meta, selectedCategories },
    loginAccount: {
      settings: {
        showInvalidMarketsBannerHideOrShow,
        showInvalidMarketsBannerFeesOrLiquiditySpread,
      },
    },
    isMobile,
    universe: { id },
    filterSortOptions: {
      maxFee,
      marketFilter,
      maxLiquiditySpread,
      sortBy,
      templateFilter,
      includeInvalidMarkets,
      marketTypeFilter,
    },
    isLogged,
    restoredAccount,
    theme,
    actions: { updateMarketsList, updateFilterSortOptions },
  } = useAppStatusStore();
  let {
    isConnected,
    marketsList: { marketCardFormat },
  } = useAppStatusStore();
  const searchPhrase = buildSearchString(keywords, selectedTagNames);
  const autoSetupMarketCardFormat = marketCardFormat
    ? marketCardFormat
    : isMobile
    ? MARKET_CARD_FORMATS.COMPACT
    : MARKET_CARD_FORMATS.CLASSIC;

  isConnected = isConnected && id != null;
  const search = searchPhrase;
  const marketsInReportingState = findMarketsInReportingState(
    markets,
    marketFilter
  );
  const filteredOutCount = meta ? meta.filteredOutCount : 0;
  marketCardFormat = autoSetupMarketCardFormat;

  const componentWrapper = useRef();
  const [state, setState] = useState({
    filterSortedMarkets: [],
    marketCount: 0,
    showPagination: false,
    selectedMarketCardType: 0,
  });

  const [offset, setOffset] = useState(1);
  const [limit, setLimit] = useState(PAGINATION_COUNT);

  const {
    actions: { updateOrderBook, updateMarketsData },
  } = useMarketsStore();

  useEffect(() => {
    if (offset !== 1) {
      setOffset(1);
    }
    updateFilteredMarkets();
  }, [
    isConnected,
    isLogged,
    search,
    selectedCategories,
    maxLiquiditySpread,
    marketFilter,
    sortBy,
    maxFee,
    templateFilter,
    includeInvalidMarkets,
    theme,
  ]);

  const {
    filterSortedMarkets,
    marketCount,
    showPagination,
    selectedMarketCardType,
  } = state;

  useEffect(() => {
    updateFilteredMarkets();
  }, [marketsInReportingState.length]);

  const headerTitle = getHeaderTitleFromProps(
    search,
    location,
    selectedCategories
  );

  useEffect(() => {
    marketListViewed(
      search,
      selectedCategories,
      maxLiquiditySpread,
      marketFilter,
      sortBy,
      maxFee,
      templateFilter,
      includeInvalidMarkets,
      state.marketCount,
      offset
    );
  }, [
    search,
    selectedCategories,
    maxLiquiditySpread,
    marketFilter,
    sortBy,
    maxFee,
    templateFilter,
    includeInvalidMarkets,
    offset,
    state.marketCount,
  ]);

  function updateFilteredMarkets() {
    window.scrollTo(0, 1);

    updateMarketsList({
      isSearching: true,
      isSearchInPlace: Boolean(search),
    });
    loadMarketsByFilter(
      {
        categories: selectedCategories ? selectedCategories : [],
        search,
        filter: marketFilter,
        sort: sortBy,
        maxFee,
        limit: marketLimit,
        offset: marketOffset,
        maxLiquiditySpread,
        includeInvalidMarkets: includeInvalidMarkets === 'show',
        templateFilter,
        marketTypeFilter,
      },
      (err, result: Getters.Markets.MarketList) => {
        if (err) return console.log('Error loadMarketsFilter:', err);
        if (componentWrapper.current) {
          // categories is also on results
          const filterSortedMarkets = result.markets.map((m) => m.id);
          const marketCount = result.meta.marketCount;
          const showPagination = marketCount > limit;
          const isSportsBook = theme === THEMES.SPORTS;
          const sportsGroups = groupSportsMarkets(
            filterSortedMarkets,
            result.markets
          );
          const sportsFilterSortedMarkets = sportsGroups.map(
            (sportGroup) => sportGroup.id
          );
          const sportsGroupCount = sportsGroups.length;
          const sportsShowPagination = sportsGroupCount > limit;
          const marketInfos = result.markets
          .filter(marketHasData => marketHasData)
          .reduce((p, marketData) => {
            if (marketData === null || marketData.id == null) return p;
            return {
              ...p,
              [marketData.id]: marketData
            };
          }, {});
          updateMarketsData(marketInfos);
          setState({
            ...state,
            filterSortedMarkets: isSportsBook
              ? sportsFilterSortedMarkets
              : filterSortedMarkets,
            marketCount: isSportsBook ? sportsGroupCount : marketCount,
            showPagination: isSportsBook
              ? sportsShowPagination
              : showPagination,
          });
          filterSortedMarkets.forEach((marketId) =>
            updateOrderBook(marketId, null, loadMarketOrderBook(marketId))
          );
          updateMarketsList({ isSearching: false, meta: result.meta });
        }
      }
    );
  }

  function updateLimit(limit) {
    setOffset(1);
    setLimit(limit);
  }

  function setPageNumber(offset) {
    setOffset(offset);
  }

  useEffect(() => {
    updateFilteredMarkets();
  }, [limit, offset]);

  const isTrading = theme === THEMES.TRADING;
  const displayFee = maxFee !== MAX_FEE_100_PERCENT;
  const displayLiquiditySpread = maxLiquiditySpread !== MAX_SPREAD_ALL_SPREADS;
  let feesLiquidityMessage = '';
  if (!displayFee && !displayLiquiditySpread) {
    feesLiquidityMessage =
      '“Fee” and “Liquidity Spread” filters are set to “All”. This puts you at risk of trading on invalid markets.';
  } else if (!displayFee || !displayLiquiditySpread) {
    feesLiquidityMessage = `The ${
      !displayFee ? '“Fee”' : '“Liquidity Spread”'
    } filter is set to “All”. This puts you at risk of trading on invalid markets.`;
  }
  // console.log("Market View Markets", filterSortedMarkets);
  return (
    <section className={Styles.MarketsView} ref={componentWrapper}>
      <HelmetTag {...MARKETS_VIEW_HEAD_TAGS} />
      {!isLogged && !restoredAccount && <LandingHero />}
      {isTrading && (
        <>
          <MarketsHeader headerTitle={headerTitle} />

          <section
            className={classNames({
              [Styles.Disabled]: isSearching,
            })}
          >
            <MarketTypeFilter
              isSearchingMarkets={isSearching}
              marketCount={marketCount}
              updateMarketsFilter={(filterOption) =>
                updateFilterSortOptions({ [MARKET_FILTER]: filterOption })
              }
              marketFilter={marketFilter}
            />

            <MarketCardFormatSwitcher />
            <FilterDropDowns />
          </section>
        </>
      )}
      {!isTrading && (
        <section>
          <h2>{headerTitle}</h2>
          <FilterDropDowns />
          <FilterSearch search={search} />
          <FilterButton />
        </section>
      )}
      {isTrading && (
        <>
          <FilterTags
            maxLiquiditySpread={maxLiquiditySpread}
            maxFee={maxFee}
            removeFeeFilter={() =>
              updateFilterSortOptions({
                [MARKET_MAX_FEES]: MAX_FEE_100_PERCENT,
              })
            }
            removeLiquiditySpreadFilter={() =>
              updateFilterSortOptions({
                [MARKET_MAX_SPREAD]: MAX_SPREAD_ALL_SPREADS,
              })
            }
            updateQuery={(param, value) =>
              updateQuery(param, value, location, history)
            }
          />
          <FilterNotice
            show={includeInvalidMarkets === 'show'}
            showDismissButton={true}
            updateLoginAccountSettings={(settings) =>
              updateLoginAccountSettings(settings)
            }
            settings={{
              propertyName: 'showInvalidMarketsBannerHideOrShow',
              propertyValue: showInvalidMarketsBannerHideOrShow,
            }}
            content={
              <span>
                Invalid markets are no longer hidden. This puts you at risk of
                trading on invalid markets.{' '}
                <a
                  href={HELP_CENTER_INVALID_MARKETS}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </a>
              </span>
            }
          />

          <FilterNotice
            show={!displayFee || !displayLiquiditySpread}
            showDismissButton={true}
            updateLoginAccountSettings={(settings) =>
              updateLoginAccountSettings(settings)
            }
            settings={{
              propertyName: 'showInvalidMarketsBannerFeesOrLiquiditySpread',
              propertyValue: showInvalidMarketsBannerFeesOrLiquiditySpread,
            }}
            content={
              <span>
                {feesLiquidityMessage}{' '}
                <a
                  href={HELP_CENTER_INVALID_MARKETS}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more
                </a>
              </span>
            }
          />
        </>
      )}
      <MarketsList
        showPagination={showPagination && !isSearching}
        filteredMarkets={filterSortedMarkets}
        marketCount={marketCount}
        limit={limit}
        updateLimit={updateLimit}
        offset={offset}
        setOffset={setPageNumber}
        marketCardFormat={marketCardFormat}
      />

      <FilterNotice
        show={
          !isSearching && filteredOutCount && filteredOutCount > 0 && isTrading
        }
        content={
          <span>
            There are {filteredOutCount} additional markets outside of the
            current filters applied. Edit filters to view all markets{' '}
          </span>
        }
      />
    </section>
  );
};

export default MarketsView;
