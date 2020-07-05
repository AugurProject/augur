import React, { Component } from 'react';

import { PAGINATION_PARAM_NAME } from 'modules/routes/constants/param-names';
import { Pagination } from 'modules/common/pagination';
import NullStateMessage from 'modules/common/null-state-message';
import { TYPE_TRADE, MARKET_CARD_FORMATS } from 'modules/common/constants';
import MarketCard from 'modules/market-cards/containers/market-card';
import { MarketData } from 'modules/types';
import { LoadingMarketCard } from 'modules/market-cards/common';
import { MagnifyingGlass } from 'modules/common/icons';
import PaginationStyles from 'modules/common/pagination.styles.less';
import Styles from 'modules/markets-list/components/markets-list-styles.less';

interface MarketsListProps {
  testid?: string;
  history: History;
  markets: MarketData[];
  filteredMarkets: string[];
  location: object;
  toggleFavorite: Function;
  loadMarketsInfoIfNotLoaded: Function;
  paginationPageParam?: string;
  linkType?: string;
  isMobile: boolean;
  pendingLiquidityOrders?: object;
  showDisputingCard?: boolean;
  outcomes?: object;
  showOutstandingReturns?: boolean;
  isSearchingMarkets: boolean;
  marketCardFormat: string;
  showPagination: boolean;
  limit?: number;
  offset?: number;
  setOffset?: Function;
  updateLimit?: Function;
  marketCount?: number;
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
    pendingLiquidityOrders: {},
    showDisputingCard: false,
    outcomes: null,
    showOutstandingReturns: false,
  };

  render() {
    const {
      filteredMarkets,
      history,
      location,
      markets,
      testid,
      marketCount,
      showPagination,
      limit,
      offset,
      setOffset,
      isSearchingMarkets,
      updateLimit,
      marketCardFormat,
    } = this.props;
    let marketCards = [];

    const loadingLimit = 10;
    if (isSearchingMarkets) {
      new Array(loadingLimit)
        .fill(null)
        .map((prop, index) =>
          marketCards.push(<LoadingMarketCard key={index + 'loading'} />)
        );
    } else {
      filteredMarkets.map(id => {
        const market = markets.find((market: MarketData) => market.id === id);
        if (market && market.id) {
          marketCards.push(
            <MarketCard
              market={market}
              condensed={marketCardFormat === MARKET_CARD_FORMATS.COMPACT}
              expandedView={marketCardFormat === MARKET_CARD_FORMATS.EXPANDED}
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
      <article className={Styles.MarketsList} data-testid={testid}>
        {marketCards.length > 0 ? (
          <>{marketCards}</>
        ) : (
          <NullStateMessage
            icon={MagnifyingGlass}
            message={'No markets found'}
            subMessage={'Try a different category or filter'}
          />
        )}
        {marketCards.length > 0 && (
          <div className={PaginationStyles.PaginationContainer}>
            <Pagination
              showPagination={showPagination}
              page={Number(offset)}
              itemCount={marketCount}
              itemsPerPage={Number(limit)}
              updateLimit={updateLimit}
              maxLimit={marketCount}
              action={setOffset}
              showLimitChanger
            />
          </div>
        )}
      </article>
    );
  }
}
