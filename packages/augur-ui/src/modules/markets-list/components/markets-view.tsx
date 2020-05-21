import React, { useRef, useState, useEffect } from 'react';
import MarketsHeader from 'modules/markets-list/components/markets-header';
import MarketsList from 'modules/markets-list/components/markets-list';
import Styles from 'modules/markets-list/components/markets-view.styles.less';
import { FilterTags } from 'modules/common/filter-tags';
import { FilterNotice } from 'modules/common/filter-notice';
import FilterDropDowns from 'modules/filter-sort/containers/filter-dropdowns';
import MarketTypeFilter from 'modules/filter-sort/components/market-type-filter';
import MarketCardFormatSwitcher from 'modules/filter-sort/components/market-card-format-switcher';
import updateQuery from 'modules/routes/helpers/update-query';
import {
  TYPE_TRADE,
  MAX_FEE_100_PERCENT,
  MAX_SPREAD_ALL_SPREADS,
  HELP_CENTER_INVALID_MARKETS,
  THEMES,
  SPORTS_MARKET_TYPES,
  CATEGORY_PARAM_NAME,
} from 'modules/common/constants';
import { MarketData } from 'modules/types';
import { Getters } from '@augurproject/sdk';
import classNames from 'classnames';
import { LandingHero } from 'modules/markets-list/components/landing-hero';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { MARKETS_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import FilterSearch from 'modules/filter-sort/containers/filter-search';
import { PillSelection } from 'modules/common/selection';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { FilterButton } from 'modules/common/buttons';
import parseQuery from 'modules/routes/helpers/parse-query';

const PAGINATION_COUNT = 10;

interface MarketsViewProps {
  markets: MarketData[];
  location: object;
  history: History;
  isConnected: boolean;
  loadMarketsByFilter: Function;
  search?: string;
  maxFee: string;
  maxLiquiditySpread: string;
  isSearching: boolean;
  includeInvalidMarkets: string;
  marketSort: string;
  setLoadMarketsPending: Function;
  updateMarketsListMeta: Function;
  selectedCategories: string[];
  removeLiquiditySpreadFilter: Function;
  removeFeeFilter: Function;
  filteredOutCount: number;
  marketFilter: string;
  updateMarketsFilter: Function;
  updateMarketsListCardFormat: Function;
  marketCardFormat: string;
  updateLoginAccountSettings: Function;
  showInvalidMarketsBannerFeesOrLiquiditySpread: boolean;
  showInvalidMarketsBannerHideOrShow: boolean;
  templateFilter: string;
  setMarketsListSearchInPlace: Function;
  marketListViewed: Function;
  marketsInReportingState: MarketData[];
  loadMarketOrderBook: Function;
}

const getHeaderTitleFromProps = (
  search: string,
  location: Location,
  selectedCategory: string[]
) => {
  if (search) {
    if (search.endsWith('*')) {
      search = search.slice(0, -1)
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

  return "Popular markets";
};

const MarketsView = ({
  history,
  location,
  markets,
  marketCardFormat,
  selectedCategories,
  updateMarketsListCardFormat,
  search = null,
  isConnected,
  updateLoginAccountSettings,
  updateMarketsFilter,
  marketFilter,
  marketSort,
  isSearching,
  showInvalidMarketsBannerFeesOrLiquiditySpread,
  showInvalidMarketsBannerHideOrShow,
  maxFee,
  maxLiquiditySpread,
  removeFeeFilter,
  removeLiquiditySpreadFilter,
  includeInvalidMarkets,
  filteredOutCount,
  setLoadMarketsPending,
  setMarketsListSearchInPlace,
  loadMarketsByFilter,
  templateFilter,
  loadMarketOrderBook,
  updateMarketsListMeta,
  marketListViewed,
  marketsInReportingState,
}: MarketsViewProps) => {
  const componentWrapper = useRef();
  const [state, setState] = useState({
    filterSortedMarkets: [],
    marketCount: 0,
    limit: PAGINATION_COUNT,
    offset: 1,
    showPagination: false,
    selectedMarketCardType: 0,
  });
  const { isLogged, restoredAccount, theme, isMobile } = useAppStatusStore();

  useEffect(() => {
    if (state.offset !== 1) {
      setState({ ...state, offset: 1 });
    }
    updateFilteredMarkets();
  }, [
    isConnected,
    isLogged,
    marketsInReportingState.length,
    search,
    selectedCategories,
    maxLiquiditySpread,
    marketFilter,
    marketSort,
    maxFee,
    templateFilter,
    includeInvalidMarkets
  ]);

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
      marketSort,
      maxFee,
      templateFilter,
      includeInvalidMarkets,
      state.marketCount,
      state.offset
    );
  }, [
    search,
    selectedCategories,
    maxLiquiditySpread,
    marketFilter,
    marketSort,
    maxFee,
    templateFilter,
    includeInvalidMarkets,
    state.offset,
    state.marketCount
  ]);
  const {
    filterSortedMarkets,
    marketCount,
    limit,
    offset,
    showPagination,
    selectedMarketCardType,
  } = state;

  function updateFilteredMarkets() {
    window.scrollTo(0, 1);

    setLoadMarketsPending(true);
    setMarketsListSearchInPlace(Boolean(search));

    loadMarketsByFilter(
      {
        categories: selectedCategories ? selectedCategories : [],
        search,
        filter: marketFilter,
        sort: marketSort,
        maxFee,
        limit,
        offset,
        maxLiquiditySpread,
        includeInvalidMarkets: includeInvalidMarkets === 'show',
        templateFilter,
      },
      (err, result: Getters.Markets.MarketList) => {
        if (err) return console.log('Error loadMarketsFilter:', err);
        if (componentWrapper.current) {
          // categories is also on results
          const filterSortedMarkets = result.markets.map(m => m.id);
          const marketCount = result.meta.marketCount;
          const showPagination = marketCount > limit;
          setState({
            ...state,
            filterSortedMarkets,
            marketCount,
            showPagination,
          });
          filterSortedMarkets.forEach(marketId =>
            loadMarketOrderBook(marketId)
          );
          updateMarketsListMeta(result.meta);
          setLoadMarketsPending(false);
        }
      }
    );
  };

  function updateLimit(limit) {
    setState({
      ...state,
      limit,
      offset: 1,
    });
  }

  function setPageNumber(offset) {
    setState({ ...state, offset });
  }

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

  return (
    <section className={Styles.MarketsView} ref={componentWrapper}>
      <HelmetTag {...MARKETS_VIEW_HEAD_TAGS} />
      {!isLogged && !restoredAccount && <LandingHero />}
      {isTrading && (
        <>
          <MarketsHeader
            headerTitle={headerTitle}
            location={location}
            isSearchingMarkets={isSearching}
            filter={marketFilter}
            sort={marketSort}
            history={history}
            selectedCategory={selectedCategories}
            search={search}
            marketCardFormat={marketCardFormat}
            updateMarketsListCardFormat={updateMarketsListCardFormat}
          />

          <section
            className={classNames({
              [Styles.Disabled]: isSearching,
            })}
          >
            <MarketTypeFilter
              isSearchingMarkets={isSearching}
              marketCount={marketCount}
              updateMarketsFilter={updateMarketsFilter}
              marketFilter={marketFilter}
            />

            <MarketCardFormatSwitcher
              marketCardFormat={marketCardFormat}
              updateMarketsListCardFormat={updateMarketsListCardFormat}
            />
            <FilterDropDowns />
          </section>
        </>
      )}
      {!isTrading && (
        <section>
          <h2>{headerTitle}</h2>
          <FilterDropDowns />
          <FilterSearch
            isSearchingMarkets={isSearching}
            search={search}
            selectedCategory={selectedCategories}
          />
          <FilterButton />
        </section>
      )}
      <FilterTags
        maxLiquiditySpread={maxLiquiditySpread}
        maxFee={maxFee}
        removeFeeFilter={removeFeeFilter}
        removeLiquiditySpreadFilter={removeLiquiditySpreadFilter}
        updateQuery={(param, value) =>
          updateQuery(param, value, location, history)
        }
      />
      <FilterNotice
        show={includeInvalidMarkets === 'show'}
        showDismissButton={true}
        updateLoginAccountSettings={updateLoginAccountSettings}
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
        updateLoginAccountSettings={updateLoginAccountSettings}
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

      <MarketsList
        testid="markets"
        markets={markets}
        showPagination={showPagination && !isSearching}
        filteredMarkets={filterSortedMarkets}
        marketCount={marketCount}
        location={location}
        history={history}
        linkType={TYPE_TRADE}
        isMobile={isMobile}
        limit={limit}
        updateLimit={updateLimit}
        offset={offset}
        setOffset={setPageNumber}
        isSearchingMarkets={isSearching}
        marketCardFormat={marketCardFormat}
      />

      <FilterNotice
        show={!isSearching && filteredOutCount && filteredOutCount > 0}
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
