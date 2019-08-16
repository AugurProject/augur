import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import MarketsHeader from 'modules/markets-list/components/markets-header';
import MarketsList from 'modules/markets-list/components/markets-list';
import { TYPE_TRADE } from 'modules/common/constants';
import { MarketData } from 'modules/types';
import { Getters } from '@augurproject/sdk';

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
  categories?: string;
  maxFee: string;
  maxLiquiditySpread: string;
  includeInvalidMarkets: string;
  universe?: string;
  defaultFilter: string;
  defaultSort: string;
  defaultHasOrders: boolean;
}

interface MarketsViewState {
  filter: string;
  sort: string;
  hasOrders: boolean;
  filterSortedMarkets: Array<string>;
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
    categories: [],
    universe: null,
  };
  loadMarketsByFilter: any;

  private componentWrapper!: HTMLElement | null;

  constructor(props) {
    super(props);

    this.state = {
      filter: props.defaultFilter,
      sort: props.defaultSort,
      hasOrders: props.defaultHasOrders,
      filterSortedMarkets: [],
      isSearchingMarkets: false,
      marketCount: 0,
      limit: PAGINATION_COUNT,
      offset: 1,
      showPagination: false,
    };

    this.setPageNumber = this.setPageNumber.bind(this);
    this.updateFilter = this.updateFilter.bind(this);
    this.updateFilteredMarkets = this.updateFilteredMarkets.bind(this);
    this.loadMarketsByFilter = props.loadMarketsByFilter.bind(this);
  }

  componentDidMount() {
    const { isConnected } = this.props;
    if (isConnected) {
      this.updateFilteredMarkets();
    }
  }

  componentDidUpdate(prevProps) {
    const { search, categories, maxFee, maxLiquiditySpread, includeInvalidMarkets, isConnected } = this.props;
    if (
      isConnected !== prevProps.isConnected ||
      (search !== prevProps.search ||
        categories !== prevProps.categories ||
        maxLiquiditySpread !== prevProps.maxLiquiditySpread ||
        maxFee !== prevProps.maxFee ||
        includeInvalidMarkets !== prevProps.includeInvalidMarkets)
    ) {
      this.updateFilteredMarkets();
    }
  }

  setPageNumber(offset) {
    this.updateFilter(Object.assign(this.state, { offset }))
  }

  updateFilter(params) {
    const { filter, sort, limit, offset } = params;
    this.setState({ filter, sort, limit, offset }, this.updateFilteredMarkets);
  }

  updateFilteredMarkets() {
    const {
      search,
      categories,
      maxFee,
      maxLiquiditySpread,
      includeInvalidMarkets,
    } = this.props;
    const { filter, sort, limit, offset } = this.state;
    this.setState({ isSearchingMarkets: true });
    this.loadMarketsByFilter(
      {
        categories,
        search,
        filter,
        sort,
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
          this.setState({ filterSortedMarkets, marketCount, showPagination });
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
    } = this.props;
    const {
      filter,
      sort,
      hasOrders,
      filterSortedMarkets,
      isSearchingMarkets,
      marketCount,
      limit,
      offset,
      showPagination
    } = this.state;
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
          filter={filter}
          sort={sort}
          hasOrders={hasOrders}
          updateFilter={this.updateFilter}
          history={history}
        />
        <MarketsList
          testid="markets"
          isLogged={isLogged}
          markets={markets}
          showPagination={showPagination}
          filteredMarkets={filterSortedMarkets}
          marketCount={marketCount}
          location={location}
          history={history}
          toggleFavorite={toggleFavorite}
          loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
          linkType={TYPE_TRADE}
          isMobile={isMobile}
          limit={limit}
          offset={offset}
          setOffset={this.setPageNumber}
        />
      </section>
    );
  }
}
