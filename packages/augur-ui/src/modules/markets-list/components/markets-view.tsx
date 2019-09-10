import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import MarketsHeader from 'modules/markets-list/components/markets-header';
import MarketsList from 'modules/markets-list/components/markets-list';
import Styles from 'modules/markets-list/components/markets-view.styles.less';
import { FilterTags } from 'modules/common/filter-tags';
import { FilterNotice } from 'modules/common/filter-notice';
import updateQuery from 'modules/routes/helpers/update-query';
import {
  TYPE_TRADE,
  MARKET_OPEN,
  MARKET_REPORTING,
  MARKET_CLOSED,
  MAX_FEE_100_PERCENT,
  MAX_SPREAD_ALL_SPREADS,
} from 'modules/common/constants';
import { MarketData } from 'modules/types';
import { Getters } from '@augurproject/sdk';
import { MarketStateLabel }  from 'modules/common/labels';

const PAGINATION_COUNT = 10;

interface MarketsViewProps {
  isLogged: boolean;
  markets: Array<MarketData>;
  location: object;
  history: object;
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
}

interface MarketsViewState {
  filterSortedMarkets: string[];
  isSearchingMarkets: boolean;
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
  loadMarketsByFilter: any;

  private componentWrapper!: HTMLElement | null;

  constructor(props) {
    super(props);

    this.state = {
      filterSortedMarkets: [],
      isSearchingMarkets: true,
      marketCount: 0,
      limit: PAGINATION_COUNT,
      offset: 1,
      showPagination: false,
    };

    this.setPageNumber = this.setPageNumber.bind(this);
    this.updateLimit = this.updateLimit.bind(this);
    this.updateFilteredMarkets = this.updateFilteredMarkets.bind(this);
    this.loadMarketsByFilter = props.loadMarketsByFilter.bind(this);
  }

  componentDidMount() {
    const {
      isConnected,
      setLoadMarketsPending,
      updateMarketsListMeta,
    } = this.props;
    if (isConnected) {
      setLoadMarketsPending(true);
      this.updateFilteredMarkets();
      updateMarketsListMeta(null);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSearching && !this.props.isSearching) {
      this.componentWrapper.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    if (
      nextProps.selectedCategories.length >
        this.props.selectedCategories.length ||
      nextProps.maxFee !== this.props.maxFee ||
      nextProps.maxLiquiditySpread !== this.props.maxLiquiditySpread ||
      nextProps.includeInvalidMarkets !== this.props.includeInvalidMarkets ||
      nextProps.marketFilter !== this.props.marketFilter ||
      nextProps.marketSort !== this.props.marketSort ||
      nextProps.search !== this.props.search
    ) {
      this.setState({
        offset: 1,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const {
      search,
      marketFilter,
      marketSort,
      maxFee,
      selectedCategories,
      maxLiquiditySpread,
      includeInvalidMarkets,
      isConnected,
    } = this.props;
    if (
      isConnected !== prevProps.isConnected ||
      (search !== prevProps.search ||
        selectedCategories !== prevProps.selectedCategories ||
        maxLiquiditySpread !== prevProps.maxLiquiditySpread ||
        marketFilter !== prevProps.marketFilter ||
        marketSort !== prevProps.marketSort ||
        maxFee !== prevProps.maxFee ||
        includeInvalidMarkets !== prevProps.includeInvalidMarkets)
    ) {
      this.updateFilteredMarkets();
    }
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

  updateFilteredMarkets() {
    const {
      search,
      selectedCategories,
      maxFee,
      maxLiquiditySpread,
      includeInvalidMarkets,
      marketFilter,
      marketSort,
    } = this.props;

    const { limit, offset } = this.state;

    this.props.setLoadMarketsPending(true);
    this.setState({ isSearchingMarkets: true });
    this.loadMarketsByFilter(
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
      },
      (err, result: Getters.Markets.MarketList) => {
        if (err) return console.log('Error loadMarketsFilter:', err);
        if (this.componentWrapper) {
          // categories is also on results
          const filterSortedMarkets = result.markets.map(m => m.id);
          const marketCount = result.meta.marketCount;
          const showPagination = marketCount > limit;
          this.setState({
            isSearchingMarkets: false,
            filterSortedMarkets,
            marketCount,
            showPagination,
          });
          this.props.updateMarketsListMeta(result.meta);
          this.props.setLoadMarketsPending(false);
          this.setState({
            marketCount,
          });
        }
      }
    );
  }

  render() {
    const {
      history,
      isLogged,
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
      updateMarketsFilter,
      marketFilter,
      marketSort,
    } = this.props;
    const {
      filterSortedMarkets,
      isSearchingMarkets,
      marketCount,
      limit,
      offset,
      showPagination,
    } = this.state;

    const displayFee = this.props.maxFee !== MAX_FEE_100_PERCENT;
    const displayLiquiditySpread = this.props.maxLiquiditySpread !== MAX_SPREAD_ALL_SPREADS;
    let feesLiquidityMessage = '';

    if (!displayFee && !displayLiquiditySpread) {
      feesLiquidityMessage = '“Fee” and “Liquidity Spread” filters are set to “All”. This puts you at risk of trading on invalid markets.';
    } else if (!displayFee || !displayLiquiditySpread) {
      feesLiquidityMessage = `The ${!displayFee ? '“Fee”' : '“Liquidity Spread”'} filter is set to “All”. This puts you at risk of trading on invalid markets.`;
    }
    const marketStatesOptions = [
      { value: MARKET_OPEN, label: 'Open' },
      { value: MARKET_REPORTING, label: 'In-reporting' },
      { value: MARKET_CLOSED, label: 'Resolved' },
    ].map((marketState, idx) => {
      return (
        <MarketStateLabel
          key={idx}
          handleClick={() => updateMarketsFilter(marketState.value)}
          selected={marketFilter === marketState.value}
          loading={isSearchingMarkets}
          count={this.state.marketCount}
          label={marketState.label}
        />
      );
    });


    return (
      <section
        ref={componentWrapper => {
          this.componentWrapper = componentWrapper;
        }}
      >
        <Helmet>
          <title>Markets</title>
        </Helmet>
        <MarketsHeader
          location={location}
          isSearchingMarkets={isSearchingMarkets}
          filter={marketFilter}
          sort={marketSort}
          history={history}
          selectedCategory={selectedCategories}
          search={search}
          updateMarketsListCardFormat={updateMarketsListCardFormat}
          marketCardFormat={marketCardFormat}
          updateMobileMenuState={updateMobileMenuState}
        />

        <div className={Styles.MarketLabelGroup}>
          {marketStatesOptions}
        </div>

        <FilterTags
          maxLiquiditySpread={this.props.maxLiquiditySpread}
          maxFee={this.props.maxFee}
          removeFeeFilter={this.props.removeFeeFilter}
          removeLiquiditySpreadFilter={this.props.removeLiquiditySpreadFilter}
          updateQuery={(param, value) =>
            updateQuery(param, value, this.props.location, this.props.history)
          }
        />

        <FilterNotice
          color={'red'}
          show={this.props.includeInvalidMarkets === 'show'}
          content={
            <span>
              Invalid markets are no longer hidden. This puts you at risk of
              trading on invalid markets.{' '}
              <a href='https://augur.net' target='_blank'>
                Learn more
              </a>
            </span>
          }
        />

        <FilterNotice
          show={!displayFee || !displayLiquiditySpread}
          content={
            <span>
              {feesLiquidityMessage}{' '}
              <a href='https://augur.net' target='_blank'>
                Learn more
              </a>
            </span>
          }
        />

        <MarketsList
          testid='markets'
          isLogged={isLogged}
          markets={markets}
          showPagination={showPagination && !isSearchingMarkets}
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
          isSearchingMarkets={isSearchingMarkets}
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
