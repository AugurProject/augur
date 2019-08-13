import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import MarketsHeader from 'modules/markets-list/components/markets-header';
import MarketsList from 'modules/markets-list/components/markets-list';
import { TYPE_TRADE } from 'modules/common/constants';
import { MarketData } from 'modules/types';
import { Getters } from '@augurproject/sdk';

interface MarketsViewProps {
  isLogged: boolean;
  markets: Array<MarketData>;
  location: object;
  history: object;
  isConnected: boolean,
  toggleFavorite: (...args: any[]) => any;
  loadMarketsInfoIfNotLoaded: (...args: any[]) => any;
  isMobile: boolean;
  loadMarketsByFilter: Function;
  search?: string;
  categories?: string;
  universe?: string;
  defaultFilter: string;
  defaultSort: string;
  defaultMaxFee: string;
  defaultHasOrders: boolean;
}

interface MarketsViewState {
  filter: string;
  sort: string;
  maxFee: string;
  hasOrders: boolean;
  filterSortedMarkets: Array<string>;
  isSearchingMarkets: boolean;
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
      maxFee: props.defaultMaxFee,
      hasOrders: props.defaultHasOrders,
      filterSortedMarkets: [],
      isSearchingMarkets: false,
    };

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
    const { search, categories, isConnected } = this.props;
    if (
      isConnected !== prevProps.isConnected ||
      (search !== prevProps.search || categories !== prevProps.categories)
    ) {
      this.updateFilteredMarkets();
    }
  }

  updateFilter(params) {
    const { filter, sort, maxFee, hasOrders } = params;
    this.setState(
      { filter, sort, maxFee, hasOrders },
      this.updateFilteredMarkets
    );
  }

  updateFilteredMarkets() {
    const { search, categories } = this.props;
    const { filter, sort, maxFee, hasOrders } = this.state;
    this.setState({ isSearchingMarkets: true });
    this.loadMarketsByFilter(
      { categories, search, filter, sort, maxFee, hasOrders },
      (err, result: Getters.Markets.MarketList) => {
        if (err) return console.log('Error loadMarketsFilter:', err);
        if (this.componentWrapper) {
          // categories is also on results
          const filterSortedMarkets = result.markets.map(m=> m.id);
          this.setState({ filterSortedMarkets });
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
      maxFee,
      hasOrders,
      filterSortedMarkets,
      isSearchingMarkets,
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
          maxFee={maxFee}
          hasOrders={hasOrders}
          updateFilter={this.updateFilter}
          history={history}
        />
        <MarketsList
          testid="markets"
          isLogged={isLogged}
          markets={markets}
          filteredMarkets={filterSortedMarkets}
          location={location}
          history={history}
          toggleFavorite={toggleFavorite}
          loadMarketsInfoIfNotLoaded={loadMarketsInfoIfNotLoaded}
          linkType={TYPE_TRADE}
          isMobile={isMobile}
        />
      </section>
    );
  }
}
