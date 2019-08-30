import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import MarketsHeader from 'modules/markets-list/components/markets-header';
import MarketsList from 'modules/markets-list/components/markets-list';
import { TYPE_TRADE, MAX_FEE_100_PERCENT, MAX_SPREAD_ALL_SPREADS } from 'modules/common/constants';
import { MarketData } from 'modules/types';
import { Getters } from '@augurproject/sdk';
import Styles from 'modules/markets-list/components/markets-view.styles.less';
import { FilterTags } from 'modules/common/filter-tags';
import { FilterNotice } from 'modules/common/filter-notice';
import updateQuery from 'modules/routes/helpers/update-query';

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
  defaultFilter: string;
  defaultSort: string;
  defaultHasOrders: boolean;
  setLoadMarketsPending: Function;
  updateMarketsListMeta: Function;
  selectedCategories: string[];
  removeLiquiditySpreadFilter: Function;
  removeFeeFilter: Function;
  filteredOutCount: number;
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
      showPagination,

    } = this.state;

    const displayFee = this.props.maxFee !== MAX_FEE_100_PERCENT;
    const displayLiquiditySpread = this.props.maxLiquiditySpread !== MAX_SPREAD_ALL_SPREADS;
    let feesLiquidityMessage = '';


    if (!displayFee && !displayLiquiditySpread) {
      feesLiquidityMessage = '“Fee” and “Liquidity Spread” filters are set to “All”. This puts you at risk of trading on invalid markets.';
    }
    else if (!displayFee || !displayLiquiditySpread) {
      feesLiquidityMessage = `The ${!displayFee ? '“Fee”' : '“Liquidity Spread”'} filter is set to “All”. This puts you at risk of trading on invalid markets.`;
    }

    return (
      <section
        className={Styles.marketsView}
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

        <FilterTags
          maxLiquiditySpread={this.props.maxLiquiditySpread}
          maxFee={this.props.maxFee}
          removeFeeFilter={this.props.removeFeeFilter}
          removeLiquiditySpreadFilter={this.props.removeLiquiditySpreadFilter}
          updateQuery={(param, value) => updateQuery(param, value, this.props.location, this.props.history)}
        />

        <FilterNotice
          color={'red'}
          show={this.props.includeInvalidMarkets === 'show'}
          content={(<span>Invalid markets are no longer hidden. This puts you at risk of trading on invalid markets. <a href='https://augur.net' target='_blank'>Learn more</a></span>)}
        />

        <FilterNotice
          show={!displayFee || !displayLiquiditySpread}
          content={(<span>{feesLiquidityMessage} <a href='https://augur.net' target='_blank'>Learn more</a></span>)}
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
          offset={offset}
          setOffset={this.setPageNumber}
          isSearchingMarkets={isSearchingMarkets}
        />

        <FilterNotice
          show={!this.props.isSearching && this.props.filteredOutCount && this.props.filteredOutCount > 0}
          content={(<span>There are {this.props.filteredOutCount} additional markets outside of the current filters applied. Edit filters to view all markets </span>)}
        />
      </section>
    );
  }
}
