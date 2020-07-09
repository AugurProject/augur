import React from 'react';

import { Pagination } from 'modules/common/pagination';
import NullStateMessage from 'modules/common/null-state-message';
import {
  MARKET_CARD_FORMATS,
  THEMES,
  SPORTS_GROUP_TYPES,
} from 'modules/common/constants';
import MarketCard from 'modules/market-cards/market-card';
import SportsMarketCard from 'modules/market-cards/sports-market-card';
import { MarketData } from 'modules/types';
import { LoadingMarketCard } from 'modules/market-cards/common';
import { MagnifyingGlass } from 'modules/common/icons';
import PaginationStyles from 'modules/common/pagination.styles.less';
import Styles from 'modules/markets-list/components/markets-list-styles.less';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { getMarkets } from 'modules/markets/selectors/markets-all';

interface MarketsListProps {
  testid?: string;
  markets?: MarketData[];
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

const { COMBO, FUTURES, DAILY } = SPORTS_GROUP_TYPES;

export const determineSportsbookType = ({ sportsBook: { groupType } }) =>
  groupType?.includes(COMBO) ? COMBO : groupType === FUTURES ? FUTURES : DAILY;

export const groupSportsMarkets = (filteredMarkets, markets) =>
  filteredMarkets.reduce((accumulator, marketId) => {
    const market = markets.find((market: MarketData) => market.id === marketId);
    if (!!market && market.sportsBook.groupId) {
      const { groupId } = market.sportsBook;
      const existingGroup = accumulator.find(
        sportsGroupObject => sportsGroupObject.id === groupId
      );
      const uniqueType = `${market.sportsBook.groupType}-${market.sportsBook.title}`;
      if (existingGroup) {
        existingGroup.markets.push(market);
        if (!existingGroup.marketTypes.includes(uniqueType)) {
          existingGroup.marketTypes.push(uniqueType);
        }
      } else {
        const type = determineSportsbookType(market);
        accumulator.push({
          type,
          id: groupId,
          marketTypes: [uniqueType],
          markets: [market],
        });
      }
    }
    return accumulator;
  }, []);

export const getSportsGroupsFromSportsIDs = (filteredSportsGroupIds, markets) => 
  filteredSportsGroupIds.reduce((accumulator, sportsGroupId) => {
    const sportsGroupMarkets = markets.filter(market => market.sportsBook.groupId === sportsGroupId);
    if (!sportsGroupMarkets[0]) {
      return accumulator;
    }
    const type = determineSportsbookType(sportsGroupMarkets[0]);
    const marketTypes = [];
    sportsGroupMarkets.forEach(market => {
      const uniqueType = `${market.sportsBook.groupType}-${market.sportsBook.title}`;
      if (!marketTypes.includes(uniqueType)) {
        marketTypes.push(uniqueType);
      }
    })
    accumulator.push({ id: sportsGroupId, markets: sportsGroupMarkets, type, marketTypes });
    return accumulator;
  }, []);
  

export const MarketsList = ({
  filteredMarkets,
  testid = 'testid',
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
  const markets = getMarkets();
  let marketCards = [];
  const testFilteredMarkets =
    (theme === THEMES.SPORTS && filteredMarkets[0] && filteredMarkets[0].length > 42)
      ? getSportsGroupsFromSportsIDs(filteredMarkets, markets)
      : groupSportsMarkets(filteredMarkets, markets);

  const loadingLimit = 10;
  if (isSearchingMarkets) {
    new Array(loadingLimit)
      .fill(null)
      .map((prop, index) =>
        marketCards.push(<LoadingMarketCard key={`${index}loading`} />)
      );
  } else if (theme === THEMES.SPORTS) {
    testFilteredMarkets.map(sportsGroup => {
      marketCards.push(
        <SportsMarketCard
          sportsGroup={sportsGroup}
          key={sportsGroup.id}
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
