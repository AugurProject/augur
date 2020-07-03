import type { Getters } from '@augurproject/sdk';
import classNames from 'classnames';
import {
  HELP_CENTER_INVALID_MARKETS,
  MAX_FEE_100_PERCENT,
  TYPE_TRADE,
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

const PAGINATION_COUNT = 10;

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
  isSearching: boolean;
  includeInvalidMarkets: string;
  universe?: string;
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
  updateMobileMenuState: Function;
  updateLoginAccountSettings: Function;
  showInvalidMarketsBannerFeesOrLiquiditySpread: boolean;
  showInvalidMarketsBannerHideOrShow: boolean;
  templateFilter: string;
  marketTypeFilter: string;
  setMarketsListSearchInPlace: Function;
  marketListViewed: Function;
  marketsInReportingState: MarketData[];
  hotLoadMarketList: Function;
  canHotload: boolean;
}

interface MarketsViewState {
  filterSortedMarkets: string[];
  marketCount: number;
  limit: number;
  offset: number;
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
      limit: PAGINATION_COUNT,
      offset: 1,
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
      canHotload,
      search,
      marketFilter,
      marketSort,
      maxFee,
      selectedCategories,
      maxLiquiditySpread,
      hotLoadMarketList,
      includeInvalidMarkets,
      isConnected,
      isLogged,
      templateFilter,
      marketTypeFilter,
      marketListViewed,
      setLoadMarketsPending
    } = this.props;
    const { marketCount, offset } = this.state;

    if (
      offset !== prevState.offset ||
      marketCount !== prevState.marketCount ||
      (search !== prevProps.search ||
        selectedCategories !== prevProps.selectedCategories ||
        maxLiquiditySpread !== prevProps.maxLiquiditySpread ||
        marketFilter !== prevProps.marketFilter ||
        marketSort !== prevProps.marketSort ||
        maxFee !== prevProps.maxFee ||
        templateFilter !== prevProps.templateFilter ||
        marketTypeFilter !== prevProps.marketTypeFilter ||
        includeInvalidMarkets !== prevProps.includeInvalidMarkets)
    ) {
      marketListViewed(
        search,
        selectedCategories,
        maxLiquiditySpread,
        marketFilter,
        marketSort,
        maxFee,
        templateFilter,
        marketTypeFilter,
        includeInvalidMarkets,
        this.state.marketCount,
        this.state.offset
      );
    }

    if (isConnected !== prevProps.isConnected && isConnected) {
      return this.updateFilteredMarkets();
    }

    if(!isConnected && canHotload !== prevProps.canHotload && canHotload ) {
      hotLoadMarketList((marketsInfo) => {
        this.setState({
          filterSortedMarkets: marketsInfo.map((market) => market.id),
          marketCount: marketsInfo.length,
          limit: marketsInfo.length,
        });
        setLoadMarketsPending(false);
      });
    }

      const filtersHaveChanged = this.haveFiltersChanged({
      search,
      marketFilter,
      marketSort,
      maxFee,
      selectedCategories,
      maxLiquiditySpread,
      includeInvalidMarkets,
      templateFilter,
      marketTypeFilter,
      prevProps,
    });

    if (
      isConnected && (
      filtersHaveChanged) || (isLogged !== prevProps.isLogged && filtersHaveChanged)
      ) {
      this.setState(
        {
          offset: 1,
        },
        () => {
          this.updateFilteredMarkets();
        }
      );
    }
  }

  haveFiltersChanged({
    search,
    marketFilter,
    marketSort,
    maxFee,
    selectedCategories,
    maxLiquiditySpread,
    includeInvalidMarkets,
    templateFilter,
    marketTypeFilter,
    prevProps}) {
    return search !== prevProps.search
      || String(selectedCategories) !== String(prevProps.selectedCategories)
      || maxLiquiditySpread !== prevProps.maxLiquiditySpread
      || marketFilter !== prevProps.marketFilter
      || marketSort !== prevProps.marketSort
      || maxFee !== prevProps.maxFee
      || templateFilter !== prevProps.templateFilter
      || marketTypeFilter !== prevProps.marketTypeFilter
      || includeInvalidMarkets !== prevProps.includeInvalidMarkets
  }

  updateLimit(limit) {
    this.setState(
      {
        limit,
        offset: 1,
      },
      () => {
        this.updateFilteredMarkets();
      }
    );
  }

  setPageNumber(offset) {
    this.setState({ offset }, () => {
      this.updateFilteredMarkets();
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
      marketSort,
      templateFilter,
      marketTypeFilter,
    } = this.props;

    const { limit, offset } = this.state;
    window.scrollTo(0, 1);

    this.props.setLoadMarketsPending(true);
    this.props.setMarketsListSearchInPlace(Boolean(search));

    this.props.loadMarketsByFilter(
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
        marketTypeFilter,
      },
      (err, result: Getters.Markets.MarketList) => {
        if (err) return console.log('Error loadMarketsFilter:', err);
        if (this.componentWrapper) {
          // categories is also on results
          const filterSortedMarkets = result.markets.map(m => m.id);
          const marketCount = result.meta.marketCount;
          const showPagination = marketCount > limit;
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
      marketSort,
      isSearching,
      showInvalidMarketsBannerFeesOrLiquiditySpread,
      showInvalidMarketsBannerHideOrShow,
      isLogged,
      restoredAccount,
    } = this.props;
    const {
      filterSortedMarkets,
      marketCount,
      limit,
      offset,
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
          sort={marketSort}
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

          <FilterDropDowns />
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
          limit={limit}
          updateLimit={this.updateLimit}
          offset={offset}
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
