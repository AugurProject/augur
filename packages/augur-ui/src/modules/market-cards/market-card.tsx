import React, { useState } from 'react';
import classNames from 'classnames';

import {
  OutcomeGroup,
  ResolvedOutcomes,
  TentativeWinner,
  TopRow,
  InfoIcons,
  TradingSideSection
} from 'modules/market-cards/common';
import toggleCategory from 'modules/routes/helpers/toggle-category';
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
  theme: string;
  isLogged?: boolean;
  history: History;
  location: Location;
  toggleFavorite: Function;
  currentAugurTimestamp: number;
  disputingWindowEndTime: number;
  condensed?: boolean;
  expandedView?: boolean;
  address: string;
  loading?: boolean;
  isFavorite?: boolean;
  hasPosition?: boolean;
  hasStaked?: boolean;
  dispute: Function;
  migrateMarketModal: Function;
  marketLinkCopied: Function;
}

const NON_DISPUTING_SHOW_NUM_OUTCOMES = 3;
const MARKET_CARD_FOLD_OUTCOME_COUNT = 2;

export const MarketCard = ({
  market,
  location,
  history,
  isLogged,
  currentAugurTimestamp,
  condensed,
  address,
  expandedView,
  loading,
  isFavorite,
  hasPosition,
  hasStaked,
  dispute,
  marketLinkCopied,
  toggleFavorite,
  theme,
}: MarketCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const {
    outcomesFormatted,
    marketType,
    scalarDenomination,
    minPriceBigNumber,
    maxPriceBigNumber,
    categories,
    id,
    reportingState,
    disputeInfo,
    endTimeFormatted,
    consensusFormatted,
  } = market;

  if (loading) {
    return <LoadingCard />;
  }

  const path =
    location.pathname === makePath(MARKETS)
      ? location
      : { pathname: makePath(MARKETS) };

  const categoriesLowerCased = categories.map(item => item.toLowerCase());
  const categoriesWithClick = categoriesLowerCased
    .filter(Boolean)
    .map((label, idx) => ({
      label,
      onClick: toggleCategory(
        categoriesLowerCased.slice(0, idx + 1).toString(),
        path,
        history
      ),
    }));

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
  const canSupport = !disputeInfo.disputePacingOn;

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
      })}
    >
      <>
        <TradingSideSection
          address={address}
          currentAugurTimestamp={currentAugurTimestamp}
          market={market}
          condensed={condensed}
          hasPosition={hasPosition}
          hasStaked={hasStaked}
        />
        <TopRow
          market={market}
          categoriesWithClick={categoriesWithClick}
          toggleFavorite={toggleFavorite}
          marketLinkCopied={marketLinkCopied}
          currentAugurTimestamp={currentAugurTimestamp}
          isLogged={isLogged}
          isFavorite={isFavorite}
        />
        <MarketTitle id={id} headerType={headerType} />
        {!condensed && !marketResolved ? (
          <>
            <OutcomeGroup
              outcomes={outcomesFormatted}
              marketType={marketType}
              scalarDenomination={scalarDenomination}
              min={minPriceBigNumber}
              max={maxPriceBigNumber}
              expanded={expandedView ? true : expanded}
              stakes={disputeInfo.stakes}
              dispute={dispute}
              inDispute={inDispute}
              showOutcomeNumber={showOutcomeNumber}
              canDispute={canDispute}
              canSupport={canSupport}
              marketId={id}
              isWarpSync={market.isWarpSync}
              theme={theme}
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
            tentativeWinner={disputeInfo.stakes.find(
              stake => stake.tentativeWinning
            )}
            dispute={dispute}
            canDispute={canDispute}
          />
        )}
      </>
      <div className={Styles.InfoIcons}>
        <InfoIcons
          market={market}
          hasPosition={hasPosition}
          hasStaked={hasStaked}
          address={address}
        />
      </div>
      {notTrading && (
        <MarketProgress
          reportingState={reportingState}
          currentTime={currentAugurTimestamp}
          endTimeFormatted={endTimeFormatted}
          reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
        />
      )}
    </div>
  );
};
