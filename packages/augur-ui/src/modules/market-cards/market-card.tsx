import React from 'react';
import classNames from 'classnames';

import {
  CategoryTagTrail,
  InReportingLabel,
  MarketTypeLabel,
  RedFlag,
  TemplateShield,
  Archived,
  CustomMarketLabel,
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
  forkingMarket: string | null;
  isForking?: boolean;
  forkingEndTime?: number;
}

interface MarketCardState {
  expanded: boolean;
}
const NON_DISPUTING_SHOW_NUM_OUTCOMES = 3;
const MARKET_CARD_FOLD_OUTCOME_COUNT = 2;
export default class MarketCard extends React.Component<
  MarketCardProps,
  MarketCardState
> {
  clipboardMarketId = new Clipboard('#copy_marketId');
  clipboardAuthor = new Clipboard('#copy_author');
  state: MarketCardState = {
    expanded: false,
  };

  expand = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  addToFavorites = () => {
    this.props.toggleFavorite(this.props.market.marketId);
  };

  render() {
    const {
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
      forkingMarket,
      isForking,
      forkingEndTime
    } = this.props;

    const s = this.state;

    const {
      outcomesFormatted,
      marketType,
      scalarDenomination,
      minPriceBigNumber,
      maxPriceBigNumber,
      categories,
      id,
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

    const marketResolved =
      reportingState === REPORTING_STATE.FINALIZED ||
      reportingState === REPORTING_STATE.AWAITING_FINALIZATION;
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
    let canDispute =
      inDispute &&
      reportingState !== REPORTING_STATE.AWAITING_NEXT_WINDOW &&
      isLogged;

    if (forkingMarket && canDispute) {
      canDispute = forkingMarket === id;
    }

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

    return (
      <div
        className={classNames(Styles.MarketCard, {
          [Styles.Loading]: loading,
          [Styles.Nonexpanding]: !expandedOptionShowing || condensed,
          [Styles.Condensed]: condensed,
          [Styles.Forking]: isForking && forkingMarket !== id,
        })}
      >
        <>
          <div>
            {(reportingState === REPORTING_STATE.PRE_REPORTING || reportingState === REPORTING_STATE.UNKNOWN) && (
              <>
                <LabelValue
                  label={condensed ? 'Volume' : 'Total Volume'}
                  value={`$${volumeFormatted.formatted}`}
                  loading={reportingState === REPORTING_STATE.UNKNOWN}
                  condensed
                />
                {!condensed && (
                  <LabelValue
                    label="Open Interest"
                    value={`$${openInterestFormatted.formatted}`}
                    loading={reportingState === REPORTING_STATE.UNKNOWN}
                    condensed
                  />
                )}
              </>
            )}
            {(reportingState !== REPORTING_STATE.PRE_REPORTING && reportingState !== REPORTING_STATE.UNKNOWN) && (
              <LabelValue
                condensed
                label="Total Dispute Stake"
                value={
                  formatAttoRep(disputeInfo.stakeCompletedTotal, {
                    zeroStyled: false,
                  }).full
                }
              />
            )}
            <div className={Styles.hoverIconTray}>
              <InfoIcons id={id} />
            </div>
            <MarketProgress
              reportingState={reportingState}
              currentTime={currentAugurTimestamp}
              endTimeFormatted={endTimeFormatted}
              reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
              reportingWindowStartTime={disputeInfo.disputeWindow.startTime}
              forkingMarket={isForking && forkingMarket === id}
              forkingEndTime={forkingEndTime}
            />
          </div>
          <div className={classNames(Styles.TopRow, Styles.HasCircularIcons, {
            [Styles.HasScalarOrInReportingLabels]: isScalar || (!marketResolved && reportingState !== REPORTING_STATE.PRE_REPORTING),
            [Styles.CustomMarket]: market.isTemplate === false,
           })}>
            <div>
              <CustomMarketLabel isTemplate={market.isTemplate} />
              <RedFlag market={market} />
              <TemplateShield market={market} />
              <Archived market={market} />
              {isScalar && !isWarpSync && (
                <MarketTypeLabel marketType={marketType} />
              )}
              {marketStatus === MARKET_REPORTING && (
                <InReportingLabel
                  marketStatus={marketStatus}
                  reportingState={reportingState}
                  disputeInfo={disputeInfo}
                  isWarpSync={market.isWarpSync}
                  isForkingMarket={isForking && forkingMarket === id}
                />
              )}
            </div>
            <CategoryTagTrail categories={categoriesWithClick} />
            <MarketProgress
              reportingState={reportingState}
              currentTime={currentAugurTimestamp}
              endTimeFormatted={endTimeFormatted}
              reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
              reportingWindowStartTime={disputeInfo.disputeWindow.startTime}
              forkingMarket={isForking && forkingMarket === id}
              forkingEndTime={forkingEndTime}
            />
            <FavoritesButton
              action={this.addToFavorites}
              isFavorite={isFavorite}
              hideText
              disabled={!isLogged}
            />
            <DotSelection>
              <SocialMediaButtons
                listView={true}
                marketDescription={market.description}
                marketAddress={market.id}
              />
              <div
                id="copy_marketId"
                data-clipboard-text={id}
                onClick={() => marketLinkCopied(market.id, MARKET_LIST_CARD)}
              >
                {CopyAlternateIcon} {COPY_MARKET_ID}
              </div>
              <div id="copy_author" data-clipboard-text={author}>
                {Person} {COPY_AUTHOR}
              </div>
            </DotSelection>
          </div>

          <MarketTitle id={id} headerType={headerType} showCustomLabel={false} />
          {!condensed && !marketResolved ? (
            <>
              <OutcomeGroup
                outcomes={outcomesFormatted}
                marketType={marketType}
                scalarDenomination={scalarDenomination}
                min={minPriceBigNumber}
                max={maxPriceBigNumber}
                expanded={expandedView ? true : s.expanded}
                reportingState={reportingState}
                stakes={disputeInfo.stakes}
                dispute={dispute}
                inDispute={inDispute}
                showOutcomeNumber={showOutcomeNumber}
                canDispute={canDispute}
                canSupport={canSupport}
                marketId={id}
                isWarpSync={market.isWarpSync}
                forkingMarket={isForking && forkingMarket === id}
              />
              {expandedOptionShowing && (
                <button onClick={this.expand}>
                  <ChevronFlip
                    stroke="#fff"
                    pointDown={s.expanded}
                    quick
                    filledInIcon
                    hover
                  />
                  {s.expanded
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
          {isForking && forkingMarket !== id && (
            <div className={Styles.MigrateMarketNotice}>
              <MigrateMarketNotice marketId={id} />
            </div>
          )}
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
              isForkingMarket={isForking && forkingMarket === id}
              canDispute={canDispute}
            />
          )}
        </>
        <div>
          <InfoIcons id={id} />
        </div>
      </div>
    );
  }
}
