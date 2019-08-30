import React, { Component } from "react";

import { PAGINATION_PARAM_NAME } from "modules/routes/constants/param-names";
import { Pagination } from "modules/common/pagination";
import NullStateMessage from "modules/common/null-state-message";
import { TYPE_TRADE } from "modules/common/constants";
import MarketCard from "modules/market-cards/containers/market-card";
import { MarketData } from "modules/types";
import Styles from "modules/markets-list/components/markets-list.sytles.less";
import { LoadingMarketCard } from "modules/market-cards/common";

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
  isSearchingMarkets: boolean;
}

interface MarketsListState {
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
      setOffset,
      isSearchingMarkets,
    } = this.props;
    let marketCards = [];

    if (isSearchingMarkets) {
      new Array(limit).fill(null).map((prop, index) => (
        marketCards.push(
          <LoadingMarketCard
            key={index + "loading"}
          />)
      ));
    } else {
      filteredMarkets.map((id) => {
        const market = markets.find(
          (market: MarketData) => market.id === id
        );
        if (market && market.id) {
          marketCards.push(
            <MarketCard
              market={market}
              condensed={false}
              location={location}
              history={history}
              key={`${market.id} - ${market.outcomes}`}
              loading={isSearchingMarkets}
            />
          );
        }
      });
    }

    return (
      <article data-testid={testid}>
        {marketCards.length > 0 ? (
          <>
          {marketCards}
          </>
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
