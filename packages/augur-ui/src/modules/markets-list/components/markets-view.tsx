import type { Getters } from '@augurproject/sdk';
import classNames from 'classnames';
import {
  HELP_CENTER_INVALID_MARKETS,
  MAX_FEE_100_PERCENT,
  TYPE_TRADE,
  PAGINATION_COUNT,
  DEFAULT_MARKET_OFFSET,
} from 'modules/common/constants';
import { FilterNotice } from 'modules/common/filter-notice';
import MarketCardFormatSwitcher
  from 'modules/filter-sort/components/market-card-format-switcher';
import MarketTypeFilter
  from 'modules/filter-sort/components/market-type-filter';
import FilterDropDowns from 'modules/filter-sort/containers/filter-dropdowns';
import MarketsHeader from 'modules/markets-list/components/markets-header';
import MarketsList from 'modules/markets-list/components/markets-list';
import Styles from 'modules/markets-list/components/markets-view.styles.less';
import LandingHero from 'modules/markets-list/containers/landing-hero';
import { MARKETS_VIEW_HEAD_TAGS } from 'modules/seo/helmet-configs';
import { HelmetTag } from 'modules/seo/helmet-tag';
import { MarketData } from 'modules/types';
import React, { Component } from 'react';
import { MARKET_LIMIT, MARKET_OFFSET } from 'modules/filter-sort/actions/update-filter-sort-options';

interface MarketsViewProps {
  isLogged: boolean;
  restoredAccount: boolean;
  markets: MarketData[];
  location: object;
  history: History;
  isConnected: boolean;
  toggleFavorite: (...args: any[]) => any;
  loadMarketsInfoIfNotLoaded: (...args: any[]) => any;
  isMobile: boolean;
  loadMarketsByFilter: Function;
  search?: string;
  maxFee: string;
  maxLiquiditySpread: string;
  marketLimit: number;
  marketOffset: number;
  isSearching: boolean;
  includeInvalidMarkets: string;
  universe?: string;
  sortBy: string;
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
  updateMobileMenuState: Function;
  updateLoginAccountSettings: Function;
  showInvalidMarketsBannerFeesOrLiquiditySpread: boolean;
  showInvalidMarketsBannerHideOrShow: boolean;
  templateFilter: string;
  marketTypeFilter: string;
  setMarketsListSearchInPlace: Function;
  marketListViewed: Function;
  marketsInReportingState: MarketData[];
  updateFilterSortOptions: Function;
  loadMarketsInfo: Function;
}

interface MarketsViewState {
  filterSortedMarkets: string[];
  marketCount: number;
  showPagination: boolean;
}

export default class MarketsView extends Component<
  MarketsViewProps,
  MarketsViewState
> {
  static defaultProps = {
    search: null,
    universe: null,
  };
  private componentWrapper!: HTMLElement | null;

  constructor(props) {
    super(props);

    this.state = {
      filterSortedMarkets: [],
      marketCount: 0,
      showPagination: false,
    };

    this.setPageNumber = this.setPageNumber.bind(this);
    this.updateLimit = this.updateLimit.bind(this);
  }

  componentDidMount() {
    const { isConnected } = this.props;
    if (isConnected) {
      this.updateFilteredMarkets();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      search,
      marketFilter,
      sortBy,
      maxFee,
      selectedCategories,
      maxLiquiditySpread,
      includeInvalidMarkets,
      isConnected,
      isLogged,
      templateFilter,
      marketTypeFilter,
      marketLimit,
      marketOffset,
      marketListViewed,
    } = this.props;
    const { marketCount } = this.state;

    if (
      marketCount !== prevState.marketCount ||
      (search !== prevProps.search ||
        selectedCategories !== prevProps.selectedCategories ||
        maxLiquiditySpread !== prevProps.maxLiquiditySpread ||
        marketFilter !== prevProps.marketFilter ||
        sortBy !== prevProps.sortBy ||
        maxFee !== prevProps.maxFee ||
        templateFilter !== prevProps.templateFilter ||
        marketTypeFilter !== prevProps.marketTypeFilter ||
        includeInvalidMarkets !== prevProps.includeInvalidMarkets ||
        marketLimit !== prevProps.marketLimit ||
        marketOffset !== prevProps.marketOffset)
    ) {
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
        this.state.marketCount,
        marketOffset,
      );
    }

    if (isConnected !== prevProps.isConnected && isConnected) {
      return this.updateFilteredMarkets();
    }

    const filtersHaveChanged = this.haveFiltersChanged({
      search,
      marketFilter,
      sortBy,
      maxFee,
      selectedCategories,
      maxLiquiditySpread,
      includeInvalidMarkets,
      templateFilter,
      marketTypeFilter,
      marketLimit,
      marketOffset,
      prevProps,
    });

    if (
      isConnected && (
      filtersHaveChanged) || (isLogged !== prevProps.isLogged && filtersHaveChanged)
      ) this.updateFilteredMarkets();
  }

  haveFiltersChanged({
    search,
    marketFilter,
    sortBy,
    maxFee,
    selectedCategories,
    maxLiquiditySpread,
    includeInvalidMarkets,
    templateFilter,
    marketTypeFilter,
    marketLimit,
    marketOffset,
    prevProps}) {
    return search !== prevProps.search
      || String(selectedCategories) !== String(prevProps.selectedCategories)
      || maxLiquiditySpread !== prevProps.maxLiquiditySpread
      || marketFilter !== prevProps.marketFilter
      || sortBy !== prevProps.sortBy
      || maxFee !== prevProps.maxFee
      || templateFilter !== prevProps.templateFilter
      || marketTypeFilter !== prevProps.marketTypeFilter
      || includeInvalidMarkets !== prevProps.includeInvalidMarkets
      || marketLimit !== prevProps.marketLimit
      || marketOffset !== prevProps.marketOffset
  }

  updateLimit(limit) {
    const { updateFilterSortOptions } = this.props;
    updateFilterSortOptions({
      [MARKET_LIMIT]: limit,
      [MARKET_OFFSET]: DEFAULT_MARKET_OFFSET,
    });
    this.updateFilteredMarkets();
  }

  setPageNumber(offset) {
    const { updateFilterSortOptions } = this.props;
    updateFilterSortOptions({
      [MARKET_OFFSET]: offset,
    });
  }

  updateFilteredMarkets = () => {
    const {
      search,
      selectedCategories,
      maxFee,
      maxLiquiditySpread,
      includeInvalidMarkets,
      marketFilter,
      sortBy,
      templateFilter,
      marketTypeFilter,
      marketLimit,
      marketOffset,
    } = this.props;

    this.componentWrapper.parentNode.scrollTop = 0;

    this.props.setLoadMarketsPending(true);
    this.props.setMarketsListSearchInPlace(Boolean(search));

    this.props.loadMarketsByFilter(
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
        if (this.componentWrapper) {
          // categories is also on results
          const filterSortedMarkets = result.markets.map(m => m.id);
          const marketCount = result.meta.marketCount;
          const showPagination = marketCount > marketLimit;
          this.setState({
            filterSortedMarkets,
            marketCount,
            showPagination,
          });
          this.props.updateMarketsListMeta(result.meta);
          this.props.setLoadMarketsPending(false);
        }
      }
    );
  }

  render() {
    const {
      history,
      isMobile,
      loadMarketsInfoIfNotLoaded,
      location,
      markets,
      toggleFavorite,
      marketCardFormat,
      selectedCategories,
      updateMarketsListCardFormat,
      search,
      updateMobileMenuState,
      updateLoginAccountSettings,
      updateMarketsFilter,
      marketFilter,
      sortBy,
      isSearching,
      showInvalidMarketsBannerFeesOrLiquiditySpread,
      showInvalidMarketsBannerHideOrShow,
      isLogged,
      restoredAccount,
      marketLimit,
      marketOffset,
    } = this.props;
    const {
      filterSortedMarkets,
      marketCount,
      showPagination,
    } = this.state;

    const displayFee = this.props.maxFee !== MAX_FEE_100_PERCENT;
    return (
      <section
        className={Styles.MarketsView}
        ref={componentWrapper => {
          this.componentWrapper = componentWrapper;
        }}
      >
        <HelmetTag {...MARKETS_VIEW_HEAD_TAGS} />
        {!isLogged && !restoredAccount && <LandingHero />}
        <MarketsHeader
          location={location}
          isSearchingMarkets={isSearching}
          filter={marketFilter}
          sort={sortBy}
          history={history}
          selectedCategory={selectedCategories}
          search={search}
          updateMobileMenuState={updateMobileMenuState}
          marketCardFormat={marketCardFormat}
          updateMarketsListCardFormat={updateMarketsListCardFormat}
        />

        <div
          className={classNames({
            [Styles.Disabled]: isSearching,
          })}
        >
          <MarketTypeFilter
            isSearchingMarkets={isSearching}
            marketCount={this.state.marketCount}
            updateMarketsFilter={updateMarketsFilter}
            marketFilter={marketFilter}
          />

          <MarketCardFormatSwitcher
            marketCardFormat={marketCardFormat}
            updateMarketsListCardFormat={updateMarketsListCardFormat}
          />

          <FilterDropDowns refresh={this.updateFilteredMarkets} />
        </div>

        <FilterNotice
          show={this.props.includeInvalidMarkets === 'show'}
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
              <a href={HELP_CENTER_INVALID_MARKETS} target="_blank" rel="noopener noreferrer">
                Learn more
              </a>
            </span>
          }
        />

        <FilterNotice
          show={!displayFee}
          showDismissButton={true}
          updateLoginAccountSettings={updateLoginAccountSettings}
          settings={{
            propertyName: 'showInvalidMarketsBannerFeesOrLiquiditySpread',
            propertyValue: showInvalidMarketsBannerFeesOrLiquiditySpread,
          }}
          content={
            <span>
              {'The “Fee” filter is set to “All”. This puts you at risk of trading on invalid markets. '}
              <a href={HELP_CENTER_INVALID_MARKETS} target="_blank" rel="noopener noreferrer">
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
          toggleFavorite={toggleFavorite}
          loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
          linkType={TYPE_TRADE}
          isMobile={isMobile}
          limit={marketLimit}
          updateLimit={this.updateLimit}
          offset={marketOffset}
          setOffset={this.setPageNumber}
          isSearchingMarkets={isSearching}
          marketCardFormat={marketCardFormat}
        />

        <FilterNotice
          show={
            !this.props.isSearching &&
            this.props.filteredOutCount &&
            this.props.filteredOutCount > 0
          }
          content={
            <span>
              There are {this.props.filteredOutCount} additional markets outside
              of the current filters applied. Edit filters to view all markets{' '}
            </span>
          }
        />
      </section>
    );
  }
}
