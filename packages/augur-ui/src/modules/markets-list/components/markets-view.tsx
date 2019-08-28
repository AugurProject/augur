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
  maxFee: string;
  maxLiquiditySpread: string;
  includeInvalidMarkets: string;
  universe?: string;
  defaultFilter: string;
  defaultSort: string;
  defaultHasOrders: boolean;
  setLoadMarketsPending: Function;
  updateMarketsListMeta: Function;
  selectedCategories: string[];
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
      isSearchingMarkets: true,
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
    const { isConnected, setLoadMarketsPending, updateMarketsListMeta } = this.props;
    if (isConnected) {
      setLoadMarketsPending(true);
      this.updateFilteredMarkets();
      updateMarketsListMeta(null);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedCategories.length > this.props.selectedCategories.length ||
        nextProps.maxFee !== this.props.maxFee ||
        nextProps.maxLiquiditySpread !== this.props.maxLiquiditySpread ||
        nextProps.includeInvalidMarkets !== this.props.includeInvalidMarkets
      ) {

      this.setState({
        offset: 1,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { search, selectedCategories, maxFee, maxLiquiditySpread, includeInvalidMarkets, isConnected } = this.props;
    if (
      isConnected !== prevProps.isConnected ||
      (search !== prevProps.search ||
        selectedCategories !== prevProps.selectedCategories ||
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
    const { filter, sort} = params;
    this.setState({ filter, sort }, this.updateFilteredMarkets);
  }

  updateFilteredMarkets() {
    const {
      search,
      selectedCategories,
      maxFee,
      maxLiquiditySpread,
      includeInvalidMarkets,
    } = this.props;
    const { filter, sort, limit, offset } = this.state;
    this.props.setLoadMarketsPending(true);
    this.setState({ isSearchingMarkets: true });
    this.loadMarketsByFilter(
      {
        categories: selectedCategories ? selectedCategories : [],
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
          this.setState({ isSearchingMarkets: false, filterSortedMarkets, marketCount, showPagination });
          this.props.updateMarketsListMeta(result.meta);
          this.props.setLoadMarketsPending(false);
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
          isSearchingMarkets={isSearchingMarkets}
        />
      </section>
    );
  }
}
