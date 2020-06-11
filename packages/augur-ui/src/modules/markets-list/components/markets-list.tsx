import React from 'react';

import { Pagination } from 'modules/common/pagination';
import NullStateMessage from 'modules/common/null-state-message';
import { MARKET_CARD_FORMATS, THEMES } from 'modules/common/constants';
import MarketCard from 'modules/market-cards/market-card';
import { MarketData } from 'modules/types';
import { LoadingMarketCard } from 'modules/market-cards/common';
import { MagnifyingGlass } from 'modules/common/icons';
import PaginationStyles from 'modules/common/pagination.styles.less';
import Styles from 'modules/markets-list/components/markets-list-styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';

interface MarketsListProps {
  testid?: string;
  markets: MarketData[];
  filteredMarkets: string[];
  pendingLiquidityOrders?: object;
  showDisputingCard?: boolean;
  outcomes?: object;
  showOutstandingReturns?: boolean;
  marketCardFormat: string;
  showPagination: boolean;
  limit?: number;
  offset?: number;
  setOffset?: Function;
  updateLimit?: Function;
  marketCount?: number;
}

const groupSportsMarkets = (filteredMarkets, markets) => {
  return filteredMarkets.reduce((accumulator, marketId) => {
    const market = markets.find((market: MarketData) => market.id === marketId);
    const SportsID = market?.sportsBookGroupId;
    if (!!SportsID) {
      const existingGroup = accumulator.find(
        sportsGroupObject => sportsGroupObject.id === SportsID
      );
      if (existingGroup) {
        existingGroup.markets.push(market);
      } else {
        accumulator.push({ id: SportsID, markets: [market] });
      }
    }
    return accumulator;
  }, []);
};

const MarketsList = ({
  filteredMarkets,
  markets,
  testid = null,
  marketCount,
  showPagination,
  limit,
  offset,
  setOffset,
  updateLimit,
  marketCardFormat,
}: MarketsListProps) => {
  const {
    theme,
    marketsList: { isSearching: isSearchingMarkets },
  } = useAppStatusStore();
  let marketCards = [];
  let sportMarketCards = [];
  const testFilteredMarkets =
    theme === THEMES.SPORTS
      ? groupSportsMarkets(filteredMarkets, markets)
      : filteredMarkets;

  const loadingLimit = 10;
  if (isSearchingMarkets) {
    new Array(loadingLimit)
      .fill(null)
      .map((prop, index) =>
        marketCards.push(<LoadingMarketCard key={`${index}loading`} />)
      );
  } else if (theme === THEMES.SPORTS) {
    testFilteredMarkets.map(sportsGroup => {
      const SportsID = sportsGroup.id;
      sportMarketCards.push(
        <MarketCard
          market={sportMarketCards.markets}
          key={SportsID}
          loading={isSearchingMarkets}
        />
      );
    });
  } else {
    filteredMarkets.map(id => {
      const market = markets.find((market: MarketData) => market.id === id);
      if (market) {
        marketCards.push(
          <MarketCard
            market={market}
            condensed={marketCardFormat === MARKET_CARD_FORMATS.COMPACT}
            expandedView={marketCardFormat === MARKET_CARD_FORMATS.EXPANDED}
            key={`${market.id} - ${market.outcomes}`}
            loading={isSearchingMarkets}
          />
        );
      }
    });
  }
  const hasMarkets = marketCards.length > 0;

  // console.log(
  //   'marketList filteredMarkets:',
  //   filteredMarkets,
  //   testFilteredMarkets,
  //   sportMarketCards,
  //   marketCards
  // );

  return (
    <article className={Styles.MarketsList} data-testid={testid}>
      {hasMarkets ? (
        <>{marketCards}</>
      ) : (
        <NullStateMessage
          icon={MagnifyingGlass}
          message="No markets found"
          subMessage="Try a different category or filter"
        />
      )}
      {hasMarkets && (
        <div className={PaginationStyles.PaginationContainer}>
          <Pagination
            showPagination={showPagination}
            page={offset}
            itemCount={marketCount}
            itemsPerPage={limit}
            updateLimit={updateLimit}
            maxLimit={marketCount}
            action={setOffset}
            showLimitChanger
          />
        </div>
      )}
    </article>
  );
};

export default MarketsList;
