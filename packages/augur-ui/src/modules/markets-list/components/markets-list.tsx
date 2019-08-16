import React, { Component } from "react";

import { PAGINATION_PARAM_NAME } from "modules/routes/constants/param-names";
import { Pagination } from "modules/common/pagination";
import NullStateMessage from "modules/common/null-state-message";
import { TYPE_TRADE } from "modules/common/constants";
import MarketCard from "modules/market-cards/containers/market-card";
import { MarketData } from "modules/types";
import Styles from "modules/markets-list/components/markets-list.sytles.less";

interface MarketsListProps {
  testid?: string;
  history: object;
  isLogged: boolean;
  markets: Array<MarketData>;
  filteredMarkets: Array<string>;
  location: object;
  toggleFavorite: Function;
  loadMarketsInfoIfNotLoaded: Function;
  paginationPageParam?: string;
  linkType?: string;
  isMobile: boolean;
  pendingLiquidityOrders?: object;
  nullMessage?: string;
  addNullPadding?: boolean;
  showDisputingCard?: boolean;
  outcomes?: object;
  showOutstandingReturns?: boolean;
  marketCount: number;
  showPagination: boolean;
  limit: number;
  offset: number;
  setOffset: Function;
}

interface MarketsListState {
  lowerBound: number;
  boundedLength: number;
  marketIdsMissingInfo: Array<any>;
}

export default class MarketsList extends Component<
  MarketsListProps,
  MarketsListState
> {
  static defaultProps = {
    testid: null,
    linkType: TYPE_TRADE,
    paginationPageParam: PAGINATION_PARAM_NAME,
    nullMessage: "No Markets Available",
    pendingLiquidityOrders: {},
    addNullPadding: false,
    showDisputingCard: false,
    outcomes: null,
    showOutstandingReturns: false
  };

  constructor(props) {
    super(props);

    this.state = {
      lowerBound: 1,
      boundedLength: 10,
      marketIdsMissingInfo: [], // This is ONLY the currently displayed markets that are missing info
    };

    this.setMarketIDsMissingInfo = this.setMarketIDsMissingInfo.bind(this);
    this.loadMarketsInfoIfNotLoaded = this.loadMarketsInfoIfNotLoaded.bind(this);
  }

  componentWillMount() {
    const { filteredMarkets, loadMarketsInfoIfNotLoaded } = this.props;
    if (loadMarketsInfoIfNotLoaded) {
      this.loadMarketsInfoIfNotLoaded(filteredMarkets);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { filteredMarkets, loadMarketsInfoIfNotLoaded } = this.props;
    const { lowerBound, boundedLength, marketIdsMissingInfo } = this.state;
    if (
      lowerBound !== nextState.lowerBound ||
      boundedLength !== nextState.boundedLength ||
      JSON.stringify(filteredMarkets) !==
        JSON.stringify(nextProps.filteredMarkets)
    ) {
      this.setMarketIDsMissingInfo(
        nextProps.filteredMarkets,
        nextState.lowerBound,
        nextState.boundedLength
      );
    }

    if (
      JSON.stringify(marketIdsMissingInfo) !==
      JSON.stringify(nextState.marketIdsMissingInfo)
    ) {
      if (loadMarketsInfoIfNotLoaded) {
        this.loadMarketsInfoIfNotLoaded(nextState.marketIdsMissingInfo);
      }
    }
  }

  setMarketIDsMissingInfo(filteredMarkets, lowerBound, boundedLength) {
    if (filteredMarkets.length && boundedLength) {
      const marketIdLength = boundedLength + (lowerBound - 1);
      const marketIdsMissingInfo = filteredMarkets.slice(
        lowerBound - 1,
        marketIdLength
      );
      this.setState({ marketIdsMissingInfo });
    }
  }

  // debounced call
  loadMarketsInfoIfNotLoaded(marketIds) {
    const { loadMarketsInfoIfNotLoaded } = this.props;
    loadMarketsInfoIfNotLoaded(marketIds || this.state.marketIdsMissingInfo);
  }

  // NOTE -- You'll notice the odd method used for rendering the previews, this is done for optimization reasons
  render() {
    const {
      filteredMarkets,
      history,
      location,
      markets,
      testid,
      nullMessage,
      addNullPadding,
      marketCount,
      showPagination,
      limit,
      offset,
      setOffset
    } = this.props;
    const s = this.state;

    return (
      <article data-testid={testid}>
        {marketCount && s.boundedLength ? (
          filteredMarkets.map((unused, i) => {
            const id = filteredMarkets[s.lowerBound - 1 + i];
            const market = markets.find(
              (market: MarketData) => market.id === id
            );

            if (market && market.id) {
              return (
                <MarketCard
                  market={market}
                  condensed={false}
                  location={location}
                  history={history}
                  key={`${market.id} - ${market.outcomes}`}
                />
              );
            }

            return null;
          })
        ) : (
          <NullStateMessage
            addNullPadding={addNullPadding}
            message={nullMessage}
          />
        )}
        {showPagination && (
          <div className={Styles.Pagination}>
            <Pagination
              page={offset}
              itemCount={marketCount}
              itemsPerPage={limit}
              action={setOffset}
            />
          </div>
        )}
      </article>
    );
  }
}
