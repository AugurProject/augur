import React, { useState } from 'react';
import classNames from 'classnames';
import {
  TopRow,
  getCategoriesWithClick,
  SportsGroupMarkets,
} from 'modules/market-cards/common';
import { DISPUTING, MARKETS } from 'modules/routes/constants/views';
import makePath from 'modules/routes/helpers/make-path';
import { HEADER_TYPE } from 'modules/common/constants';
import { MarketProgress } from 'modules/common/progress';
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
  },
  loading: boolean;
}

export const SportsMarketCard = ({ sportsGroup, loading }: SportsMarketCardProps) => {
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();

  if (loading) {
    return <LoadingCard />;
  }
  // TODO: do this better when i have any idea of how this will work...
  // for now just grab the first market for major stats.
  const market = sportsGroup.markets[0];
  const { categories, reportingState, disputeInfo, endTimeFormatted } = market;

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
      <MarketProgress
        reportingState={reportingState}
        endTimeFormatted={endTimeFormatted}
        reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
      />
      {sportsGroup.markets.length > 1 && (
        <button onClick={() => setShowMore(!showMore)}>
          {ThickChevron} {`${showMore ? 'Show Less' : 'More Wagers'}`}
        </button>
      )}
    </div>
  );
};

export default SportsMarketCard;
