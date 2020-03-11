import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import {
  CategoryTagTrail,
  InReportingLabel,
  MarketTypeLabel,
  RedFlag,
  TemplateShield,
} from 'modules/common/labels';
import {
  HoverIcon,
  LabelValue,
  OutcomeGroup,
  ResolvedOutcomes,
  TentativeWinner,
} from 'modules/market-cards/common';
import toggleCategory from 'modules/routes/helpers/toggle-category';
import { DISPUTING, MARKETS } from 'modules/routes/constants/views';
import makePath from 'modules/routes/helpers/make-path';
import {
  COPY_AUTHOR,
  COPY_MARKET_ID,
  HEADER_TYPE,
  MARKET_REPORTING,
  REPORTING_STATE,
  SCALAR,
  THEMES,
} from 'modules/common/constants';
import { FavoritesButton } from 'modules/common/buttons';
import Clipboard from 'clipboard';
import { DotSelection } from 'modules/common/selection';
import SocialMediaButtons from 'modules/market/containers/social-media-buttons';
import {
  DesignatedReporter,
  DisputeStake,
  MarketCreator,
  CopyAlternateIcon,
  Person,
  PositionIcon,
  Rules,
} from 'modules/common/icons';
import { MarketProgress } from 'modules/common/progress';
import ChevronFlip from 'modules/common/chevron-flip';
import { MarketData } from 'modules/types';
import { formatAttoRep } from 'utils/format-number';
import MigrateMarketNotice from 'modules/market-cards/containers/migrate-market-notice';
import Styles from 'modules/market-cards/market-card.styles.less';
import MarketTitle from 'modules/market/containers/market-title';
import { MARKET_LIST_CARD } from 'services/analytics/helpers';
import { isSameAddress } from 'utils/isSameAddress';

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
  useEffect(() => {
    const clipboardMarketId = new Clipboard('#copy_marketId');
    const clipboardAuthor = new Clipboard('#copy_author');
  }, [market.id, market.author]);
  const {
    outcomesFormatted,
    settlementFeePercent,
    marketType,
    scalarDenomination,
    minPriceBigNumber,
    maxPriceBigNumber,
    categories,
    id,
    description,
    marketStatus,
    author,
    reportingState,
    openInterestFormatted,
    volumeFormatted,
    disputeInfo,
    endTimeFormatted,
    designatedReporter,
    isTemplate,
    consensusFormatted,
    mostLikelyInvalid,
    isWarpSync,
  } = market;

  if (loading) {
    return (
      <div
        className={classNames(Styles.MarketCard, {
          [Styles.Loading]: loading,
        })}
      >
        {loading && (
          <>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </>
        )}
      </div>
    );
  }

  const InfoIcons = ({ id }) => (
    <>
      {address && isSameAddress(address, author) && (
        <HoverIcon
          id={id}
          label="marketCreator"
          icon={MarketCreator}
          hoverText="Market Creator"
        />
      )}
      {address && isSameAddress(address, designatedReporter) && (
        <HoverIcon
          id={id}
          label="reporter"
          icon={DesignatedReporter}
          hoverText="Designated Reporter"
        />
      )}
      {hasPosition && (
        <HoverIcon
          id={id}
          label="Position"
          icon={PositionIcon}
          hoverText="Position"
        />
      )}
      {hasStaked && (
        <HoverIcon
          id={id}
          label="dispute"
          icon={DisputeStake}
          hoverText="Dispute Stake"
        />
      )}
    </>
  );

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
        <div>
          {reportingState === REPORTING_STATE.PRE_REPORTING && (
            <>
              <LabelValue
                label={condensed ? 'Volume' : 'Total Volume'}
                value={`${volumeFormatted.full}`}
                condensed
              />
              {!condensed && (
                <LabelValue
                  label="Open Interest"
                  value={`${openInterestFormatted.full}`}
                  condensed
                />
              )}
            </>
          )}
          {reportingState !== REPORTING_STATE.PRE_REPORTING && (
            <LabelValue
              condensed
              label="Total Dispute Stake"
              value={formatAttoRep(disputeInfo.stakeCompletedTotal).full}
            />
          )}
          <div className={Styles.hoverIconTray}>{InfoIcons}</div>
          <MarketProgress
            reportingState={reportingState}
            currentTime={currentAugurTimestamp}
            endTimeFormatted={endTimeFormatted}
            reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
          />
        </div>
        <div
          className={classNames(Styles.TopRow, {
            [Styles.scalar]: isScalar,
            [Styles.template]: isTemplate,
            [Styles.invalid]: mostLikelyInvalid,
          })}
        >
          {marketStatus === MARKET_REPORTING && (
            <InReportingLabel
              marketStatus={marketStatus}
              reportingState={reportingState}
              disputeInfo={disputeInfo}
              isWarpSync={market.isWarpSync}
            />
          )}
          {isScalar && !isWarpSync && (
            <MarketTypeLabel marketType={marketType} />
          )}
          <RedFlag market={market} />
          {isTemplate && <TemplateShield market={market} />}
          <CategoryTagTrail categories={categoriesWithClick} />
          {notTrading ? (
            <>
              <span className={Styles.MatchedLine}>
                Matched<b>{` ${volumeFormatted.full}`}</b>
                {` (${settlementFeePercent.full} fee)`}
              </span>
              <button
                className={Styles.RulesButton}
                onClick={() => console.log('pop up a rules modal')}
              >
                {Rules} Rules
              </button>
            </>
          ) : (
            <MarketProgress
              reportingState={reportingState}
              currentTime={currentAugurTimestamp}
              endTimeFormatted={endTimeFormatted}
              reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
            />
          )}
          <FavoritesButton
            action={() => toggleFavorite(id)}
            isFavorite={isFavorite}
            hideText
            disabled={!isLogged}
          />
          <DotSelection>
            <SocialMediaButtons
              listView
              marketDescription={description}
              marketAddress={id}
            />
            <div
              id="copy_marketId"
              data-clipboard-text={id}
              onClick={() => marketLinkCopied(id, MARKET_LIST_CARD)}
            >
              {CopyAlternateIcon} {COPY_MARKET_ID}
            </div>
            <div id="copy_author" data-clipboard-text={author}>
              {Person} {COPY_AUTHOR}
            </div>
          </DotSelection>
        </div>

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
        <InfoIcons id={id} />
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
