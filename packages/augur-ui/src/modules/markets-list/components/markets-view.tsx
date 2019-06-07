import React, { Component } from "react";
import { Helmet } from "react-helmet";

import MarketsHeader from "modules/markets-list/components/markets-header/markets-header";
import MarketsList from "modules/markets-list/components/markets-list";
import { TYPE_TRADE } from "modules/common/constants";
import { MarketData } from "modules/types";

interface MarketsViewProps {
  isLogged: boolean;
  markets: Array<MarketData>;
  location: object;
  history: object;
  toggleFavorite: (...args: any[]) => any;
  loadMarketsInfoIfNotLoaded: (...args: any[]) => any;
  isMobile: boolean;
  loadMarketsByFilter:Function;
  search?: string;
  category?: string;
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
  filterSortedMarkets: Array<any>;
  isSearchingMarkets: boolean;
}

export default class MarketsView extends Component<MarketsViewProps, MarketsViewState> {
  static defaultProps = {
    search: null,
    category: null,
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
    const { universe } = this.props;
    if (universe) {
      this.updateFilteredMarkets();
    }
  }

  componentDidUpdate(prevProps) {
    const { search, category, universe } = this.props;
    if (
      universe !== prevProps.universe ||
      (search !== prevProps.search || category !== prevProps.category)
    ) {
      this.updateFilteredMarkets();
    }
  }

  updateFilter(params) {
    const { filter, sort, maxFee, hasOrders } = params;
    this.setState(
      { filter, sort, maxFee, hasOrders },
      this.updateFilteredMarkets,
    );
  }

  updateFilteredMarkets() {
    const { search, category } = this.props;
    const { filter, sort, maxFee, hasOrders } = this.state;
    this.setState({ isSearchingMarkets: true });
    this.loadMarketsByFilter(
      { category, search, filter, sort, maxFee, hasOrders },
      (err, filterSortedMarkets) => {
        if (err) return console.log("Error loadMarketsFilter:", err);
        if (this.componentWrapper) {
          this.setState({ filterSortedMarkets });
          setTimeout(() => this.setState({ isSearchingMarkets: false }), 500);
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
        ref={(componentWrapper) => {
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
