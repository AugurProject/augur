import React, { useState } from 'react';
import classNames from 'classnames';
import {
  TopRow,
  getCategoriesWithClick,
  SportsGroupMarkets,
} from 'modules/market-cards/common';
import { DISPUTING, MARKETS } from 'modules/routes/constants/views';
import makePath from 'modules/routes/helpers/make-path';
import {
  HEADER_TYPE,
  SPORTS_GROUP_TYPES,
  SPORTS_GROUP_MARKET_TYPES,
} from 'modules/common/constants';
import { CountdownProgress, formatTime } from 'modules/common/progress';
import Styles from 'modules/market-cards/sports-market-card.styles.less';
import MarketTitle from 'modules/market/components/common/market-title';
import { ThickChevron } from 'modules/common/icons';
import { useLocation } from 'react-router';
import { LoadingCard } from 'modules/market-cards/market-card';
import { MarketInfos } from 'modules/types';

interface SportsMarketCardProps {
  sportsGroup: {
    id: string;
    type: string;
    markets: Array<MarketInfos>;
    marketTypes: Array<string>;
  };
  loading: boolean;
}

const { COMBO, FUTURES, DAILY } = SPORTS_GROUP_TYPES;

const { MONEY_LINE } = SPORTS_GROUP_MARKET_TYPES;

const determineStartState = ({ type, marketTypes }) => {
    if (type !== DAILY) return false;
    const hasMoneyLineMarket = marketTypes.find(uniqueType => uniqueType.includes(MONEY_LINE));
    return !hasMoneyLineMarket;
}

export const SportsMarketCard = ({
  sportsGroup,
  loading,
}: SportsMarketCardProps) => {
  const [showMore, setShowMore] = useState(determineStartState(sportsGroup));
  const location = useLocation();
  if (loading) {
    return <LoadingCard />;
  }
  // TODO: do this better when i have any idea of how this will work...
  // for now just grab the first market for major stats.
  const { type, markets, marketTypes } = sportsGroup;
  const market = markets[0];
  const { categories, reportingState, endTimeFormatted } = market;
  const numExtraWagers = type === COMBO ? markets.length - 3 : markets.length - 1;
  const showMoreButtonVisible = numExtraWagers > 0;

  const headerType =
    location.pathname === makePath(DISPUTING)
      ? HEADER_TYPE.H2
      : location.pathname === makePath(MARKETS)
      ? HEADER_TYPE.H3
      : undefined;

  return (
    <div
      className={classNames(Styles.SportsMarketCard, {
        [Styles.ShowMore]: showMore,
      })}
    >
      <TopRow
        market={market}
        categoriesWithClick={getCategoriesWithClick(categories)}
      />
      <MarketTitle id={market.id} headerType={headerType} />
      <SportsGroupMarkets sportsGroup={sportsGroup} />
      <CountdownProgress
        label={
          type === FUTURES ? 'Event Expiration Date' : 'Estimated Start Time'
        }
        time={
          type === FUTURES
            ? endTimeFormatted
            : formatTime(market.sportsBook.estTimestamp)
        }
        reportingState={reportingState}
      />
      {showMoreButtonVisible && (
        <button onClick={() => setShowMore(!showMore)}>
          {ThickChevron} {`${showMore ? 'Show Less' : 'More Wagers'} (${numExtraWagers})`}
        </button>
      )}
    </div>
  );
};

export default SportsMarketCard;
