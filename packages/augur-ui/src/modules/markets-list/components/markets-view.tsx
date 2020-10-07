import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';
import MarketsHeader from 'modules/markets-list/components/markets-header';
import {
  MarketsList,
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
  SPORTS_MARKET_TYPES,
  MAX_FEE_100_PERCENT,
  MAX_SPREAD_ALL_SPREADS,
  MARKET_OPEN,
  MARKET_SORT_PARAMS,
  SORT_OPTIONS,
  SORT_OPTIONS_SPORTS,
} from 'modules/common/constants';
import { PillSelection } from 'modules/common/selection';
import { Getters } from '@augurproject/sdk';
import classNames from 'classnames';
import { LandingHero } from 'modules/markets-list/components/landing-hero';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { MARKETS_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import FilterSearch from 'modules/filter-sort/filter-search';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { SportsSortButton } from 'modules/common/buttons';
import parseQuery from 'modules/routes/helpers/parse-query';
import { useMarketsStore } from 'modules/markets/store/markets';
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
  MARKET_SORT,
} from 'modules/app/store/constants';
import { updateLoginAccountSettings } from '../actions/update-login-account-settings';
import { marketListViewed } from 'services/analytics/helpers';
import { categoriesGroup } from 'modules/app/components/inner-nav/category-filters.styles.less';

const PAGINATION_COUNT = 10;

const findMarketsInReportingState = (markets, reportingState) => {
  const reportingStates: String[] = organizeReportingStates(reportingState);
  return markets.filter(market =>
    reportingStates.find(state => state === market.reportingState)
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
    marketsList: {
      isSearching,
      meta,
      selectedCategories,
      sportsGroupTypeFilter,
      selectedCategory,
    },
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

  const {
    actions: { updateMarketsData },
  } = useMarketsStore();
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
  const isSports = theme === THEMES.SPORTS;
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
  useEffect(() => {
    if (isSports) {
      updateFilterSortOptions({
        [MARKET_SORT]: SORT_OPTIONS_SPORTS[0].value,
      })
    } else {
      updateFilterSortOptions({
        [MARKET_SORT]: SORT_OPTIONS[0].value,
      })
    }
  }, [
    theme
  ])
  const sortByStartTime = sortBy === MARKET_SORT_PARAMS.ESTIMATED_START_TIME ;

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
        filter: isSports ? MARKET_OPEN : marketFilter,
        sort: sortByStartTime && isSports ? MARKET_SORT_PARAMS.END_DATE : sortBy,
        maxFee,
        limit,
        offset,
        maxLiquiditySpread,
        includeInvalidMarkets: includeInvalidMarkets === 'show',
        templateFilter,
        marketTypeFilter,
      },
      (err, result: Getters.Markets.MarketList) => {
        if (err) return console.log('Error loadMarketsFilter:', err);
        if (componentWrapper.current) {
          // categories is also on results
          const filterSortedMarkets = result.markets.map(m => m.id);
          const marketCount = result.meta.marketCount;
          const showPagination = marketCount > limit;
          const isSportsBook = theme === THEMES.SPORTS;
          const sportsGroups = groupSportsMarkets(
            filterSortedMarkets,
            result.markets
          );
          let sportsFilterSortedMarkets = sportsGroups.map(
            sportGroup => sportGroup.id
          );
          const sportsGroupCount = sportsGroups.length;
          const numDaily = sportsGroups.filter(
            m => m.type === SPORTS_MARKET_TYPES[0].header
          ).length;
          const numFutures = sportsGroups.filter(
            m => m.type === SPORTS_MARKET_TYPES[1].header
          ).length;
          const selectedNum =
            SPORTS_MARKET_TYPES[0].header === sportsGroupTypeFilter
              ? numDaily
              : numFutures;
          let newSportsGroupTypeFilter = sportsGroupTypeFilter;
          if (
            selectedNum === 0 &&
            sportsFilterSortedMarkets.length > 0 &&
            selectedCategories.length > 1
          ) {
            newSportsGroupTypeFilter =
              sportsGroupTypeFilter === SPORTS_MARKET_TYPES[0].header
                ? SPORTS_MARKET_TYPES[1].header
                : sportsGroupTypeFilter;
          }
          if (sortByStartTime && isSports) {
            sportsFilterSortedMarkets = sportsFilterSortedMarkets.sort((market1, market2) => market2?.sportsBook?.estTimestamp - market1?.sportsBook?.estTimestamp);
          }
          const sportsShowPagination = sportsGroupCount > limit;
          const marketInfos = result.markets
            .filter(marketHasData => marketHasData)
            .reduce((p, marketData) => {
              if (marketData === null || marketData.id == null) return p;
              return {
                ...p,
                [marketData.id]: marketData,
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
          // TODO: put liquidity getter here if we are in sportsbook.
          let data = {
            isSearching: false,
            meta: result.meta,
            sportsGroupTypeFilter: newSportsGroupTypeFilter,
          };
          if (!selectedCategories || selectedCategories.length === 0) {
            data.allCategoriesMeta = result.meta;
          }
          updateMarketsList(data);
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
  const sportsTitle = selectedCategory ? selectedCategory : 'Popular Markets';
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
              updateMarketsFilter={filterOption =>
                updateFilterSortOptions({ [MARKET_FILTER]: filterOption })
              }
              marketFilter={marketFilter}
            />

            <MarketCardFormatSwitcher />
            <FilterDropDowns refresh={updateFilteredMarkets} />
          </section>
        </>
      )}
      {!isTrading && (
        <section>
          <h3>{sportsTitle}</h3>
          <PillSelection
            options={SPORTS_MARKET_TYPES}
            defaultSelection={
              SPORTS_MARKET_TYPES[0].header === sportsGroupTypeFilter ? 0 : 1
            }
            onChange={v => {
              if (SPORTS_MARKET_TYPES[v].header !== sportsGroupTypeFilter) {
                updateMarketsList({
                  sportsGroupTypeFilter: SPORTS_MARKET_TYPES[v].header,
                });
              }
            }}
            large
            hide={!(selectedCategories.length > 1)}
          />
          <FilterDropDowns />
          <FilterSearch search={search} />
          <SportsSortButton />
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
            updateLoginAccountSettings={settings =>
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
            updateLoginAccountSettings={settings =>
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
