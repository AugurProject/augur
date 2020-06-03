import React, { useState } from 'react';
import classNames from 'classnames';
import { useLocation } from 'react-router';

import {
  OutcomeGroup,
  ResolvedOutcomes,
  TentativeWinner,
  TopRow,
  InfoIcons,
  TradingSideSection,
  getCategoriesWithClick
} from 'modules/market-cards/common';
import { DISPUTING, MARKETS } from 'modules/routes/constants/views';
import makePath from 'modules/routes/helpers/make-path';
import {
  HEADER_TYPE,
  REPORTING_STATE,
  SCALAR,
  THEMES,
} from 'modules/common/constants';
import { MarketProgress } from 'modules/common/progress';
import ChevronFlip from 'modules/common/chevron-flip';
import { MarketData } from 'modules/types';
import MigrateMarketNotice from 'modules/market-cards/containers/migrate-market-notice';
import Styles from 'modules/market-cards/market-card.styles.less';
import MarketTitle from 'modules/market/containers/market-title';
import { ThickChevron } from 'modules/common/icons';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { hasStakeInMarket } from 'modules/account/helpers/common';

const LoadingCard = () => (<div
className={classNames(Styles.MarketCard, {
  [Styles.Loading]: true,
})}
>
  <div />
  <div />
  <div />
  <div />
  <div />
  <div />
  <div />
</div>
);

interface MarketCardProps {
  market: MarketData;
  location: Location;
  condensed?: boolean;
  expandedView?: boolean;
  loading?: boolean;
}

const NON_DISPUTING_SHOW_NUM_OUTCOMES = 3;
const MARKET_CARD_FOLD_OUTCOME_COUNT = 2;

export const MarketCard = ({
  market,
  condensed,
  expandedView,
  loading,
}: MarketCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { theme, isLogged, accountPositions } = useAppStatusStore();
  const location = useLocation();
  const {
    outcomesFormatted,
    marketType,
    categories,
    id,
    reportingState,
    disputeInfo,
    endTimeFormatted,
    consensusFormatted,
  } = market;
  const hasStaked = hasStakeInMarket(id);
  const hasPosition = !!accountPositions[id];

  if (loading) {
    return <LoadingCard />;
  }

  const marketResolved = reportingState === REPORTING_STATE.FINALIZED;
  const isScalar = marketType === SCALAR;
  const inDispute =
    reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE ||
    reportingState === REPORTING_STATE.AWAITING_NEXT_WINDOW;
  let showOutcomeNumber = inDispute
    ? MARKET_CARD_FOLD_OUTCOME_COUNT
    : NON_DISPUTING_SHOW_NUM_OUTCOMES;
  if (isScalar && inDispute) {
    showOutcomeNumber = MARKET_CARD_FOLD_OUTCOME_COUNT - 1;
  }
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

  const restOfOutcomes =
    isScalar && inDispute
      ? disputeInfo.stakes.length - showOutcomeNumber - 1
      : outcomesFormatted.length - showOutcomeNumber;

  const expandedOptionShowing = restOfOutcomes > 0 && !expandedView;
  const notTrading = theme !== THEMES.TRADING;

  return (
    <div
      className={classNames(Styles.MarketCard, {
        [Styles.Loading]: loading,
        [Styles.Nonexpanding]: !expandedOptionShowing || condensed,
        [Styles.Condensed]: condensed,
        [Styles.Scalar]: isScalar,
        [Styles.ShowMore]: notTrading && showMore
      })}
    >
      <>
        <TradingSideSection
          market={market}
          condensed={condensed}
          hasPosition={hasPosition}
          hasStaked={hasStaked}
        />
        <TopRow
          market={market}
          categoriesWithClick={getCategoriesWithClick(categories)}
        />
        <MarketTitle id={id} headerType={headerType} />
        {!condensed && !marketResolved ? (
          <>
            <OutcomeGroup
              expanded={expandedView ? true : expanded}
              showOutcomeNumber={showOutcomeNumber}
              canDispute={canDispute}
              canSupport={canSupport}
              market={market}
            />
            {expandedOptionShowing && (
              <button onClick={() => setExpanded(!expanded)}>
                <ChevronFlip pointDown={expanded} quick filledInIcon hover />
                {expanded
                  ? 'show less'
                  : `${restOfOutcomes} more outcome${
                      restOfOutcomes > 1 ? 's' : ''
                    }`}
              </button>
            )}
          </>
        ) : (
          <div style={{ display: 'none' }}></div>
        )}
        <MigrateMarketNotice marketId={id} />
        {marketResolved && (
          <ResolvedOutcomes
            consensusFormatted={consensusFormatted}
            outcomes={outcomesFormatted}
            expanded={expandedView}
          />
        )}
        {condensed && inDispute && (
          <TentativeWinner
            market={market}
            canDispute={canDispute}
          />
        )}
      </>
      <div className={Styles.InfoIcons}>
        <InfoIcons
          market={market}
          hasPosition={hasPosition}
          hasStaked={hasStaked}
        />
      </div>
      {notTrading && (
        <>
        <MarketProgress
          reportingState={reportingState}
          endTimeFormatted={endTimeFormatted}
          reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
        />
        <button
          onClick={() => setShowMore(!showMore)}
        >
          {ThickChevron} {`${showMore ? 'Show Less' : 'Show More' }`}
        </button>
        </>
      )}
    </div>
  );
};

export default MarketCard;