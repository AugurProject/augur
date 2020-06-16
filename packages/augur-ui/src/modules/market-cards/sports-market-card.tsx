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
  REPORTING_STATE,
} from 'modules/common/constants';
import { MarketProgress } from 'modules/common/progress';
import ChevronFlip from 'modules/common/chevron-flip';
import Styles from 'modules/market-cards/sports-market-card.styles.less';
import MarketTitle from 'modules/market/components/common/market-title';
import { ThickChevron } from 'modules/common/icons';
import { useLocation } from 'react-router';
import {
  LoadingCard,
  NON_DISPUTING_SHOW_NUM_OUTCOMES,
  MARKET_CARD_FOLD_OUTCOME_COUNT,
} from 'modules/market-cards/market-card';
import { useAppStatusStore } from 'modules/app/store/app-status';

export const SportsMarketCard = ({
  sportsGroup,
  loading,
}: MarketCardProps) => {
  const [showMore, setShowMore] = useState(false);
  const { theme, isLogged } = useAppStatusStore();
  const location = useLocation();
  // console.log(loading, sportsGroup);
  // TODO: do this better when i have any idea of how this will work...
  // for now just grab the first market for major stats.
  const market = sportsGroup.markets[0];
  const {
    outcomesFormatted,
    categories,
    reportingState,
    disputeInfo,
    endTimeFormatted,
  } = market;
  const marketResolved = reportingState === REPORTING_STATE.FINALIZED;
  const inDispute =
    reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE ||
    reportingState === REPORTING_STATE.AWAITING_NEXT_WINDOW;
  let showOutcomeNumber = inDispute
    ? MARKET_CARD_FOLD_OUTCOME_COUNT
    : NON_DISPUTING_SHOW_NUM_OUTCOMES;
    const canDispute =
    inDispute &&
    reportingState !== REPORTING_STATE.AWAITING_NEXT_WINDOW &&
    isLogged;
  const canSupport = !disputeInfo?.disputePacingOn;

  const headerType =
    location.pathname === makePath(DISPUTING)
      ? HEADER_TYPE.H2
      : location.pathname === makePath(MARKETS)
      ? HEADER_TYPE.H3
      : undefined;

  const restOfOutcomes = outcomesFormatted.length - showOutcomeNumber;
  if (loading) {
    return <LoadingCard />;
  }
  return (
    <div className={classNames(Styles.SportsMarketCard)}>
      <TopRow
        market={market}
        categoriesWithClick={getCategoriesWithClick(categories)}
      />
      <MarketTitle id={market.id} headerType={headerType} />
      <SportsGroupMarkets markets={sportsGroup.markets} />
      <MarketProgress
        reportingState={reportingState}
        endTimeFormatted={endTimeFormatted}
        reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
      />
      <button onClick={() => setShowMore(!showMore)}>
        {ThickChevron} {`${showMore ? 'Show Less' : 'More Wagers'}`}
      </button>
    </div>
  );
};

export default SportsMarketCard;