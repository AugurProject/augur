import React from 'react';
import classNames from 'classnames';

import { CategoryTagTrail, InReportingLabel } from 'modules/common/labels';
import {
  OutcomeGroup,
  LabelValue,
  HoverIcon,
  ResolvedOutcomes,
} from 'modules/market-cards/common';
import toggleCategory from 'modules/routes/helpers/toggle-category';
import { MARKETS } from 'modules/routes/constants/views';
import makePath from 'modules/routes/helpers/make-path';
import {
  COPY_MARKET_ID,
  COPY_AUTHOR,
  REPORTING_STATE,
  MARKET_REPORTING,
  SCALAR,
} from 'modules/common/constants';
import { FavoritesButton } from 'modules/common/buttons';
import Clipboard from 'clipboard';
import { DotSelection } from 'modules/common/selection';
import {
  PaperClip,
  Person,
  MarketCreator,
  PositionIcon,
  DesignatedReporter,
  DisputeStake,
  TemplateIcon,
} from 'modules/common/icons';
import { MarketProgress } from 'modules/common/progress';
import ChevronFlip from 'modules/common/chevron-flip';
import { MarketData } from 'modules/types';
import { formatAttoRep } from 'utils/format-number';
import MigrateMarketNotice from 'modules/market-cards/containers/migrate-market-notice';

import Styles from 'modules/market-cards/market-card.styles.less';
import MarketTitle from 'modules/market/containers/market-title';
import { MARKET_LIST_CARD } from 'services/analytics/helpers';

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
      isTemplate
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

    const InfoIcons = (
      <>
        {address && address.toUpperCase() === author.toUpperCase() && (
          <HoverIcon
            label='marketCreator'
            icon={MarketCreator}
            hoverText='Market Creator'
          />
        )}
        {address &&
          address.toUpperCase() === designatedReporter.toUpperCase() && (
            <HoverIcon
              label='reporter'
              icon={DesignatedReporter}
              hoverText='Designated Reporter'
            />
          )}
        {hasPosition && (
          <HoverIcon
            label='Position'
            icon={PositionIcon}
            hoverText='Position'
          />
        )}
        {hasStaked && (
          <HoverIcon
            label='dispute'
            icon={DisputeStake}
            hoverText='Dispute Stake'
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
    const inDispute =
      reportingState === REPORTING_STATE.CROWDSOURCING_DISPUTE ||
      reportingState === REPORTING_STATE.AWAITING_NEXT_WINDOW;
    let showOutcomeNumber = inDispute
      ? MARKET_CARD_FOLD_OUTCOME_COUNT
      : NON_DISPUTING_SHOW_NUM_OUTCOMES;
    if (marketType === SCALAR && inDispute) {
      showOutcomeNumber = MARKET_CARD_FOLD_OUTCOME_COUNT - 1;
    }
    const canDispute =
      inDispute &&
      reportingState !== REPORTING_STATE.AWAITING_NEXT_WINDOW &&
      isLogged;
    const canSupport = !disputeInfo.disputePacingOn;

    return (
      <div
        className={classNames(Styles.MarketCard, { [Styles.Loading]: loading })}
      >
        <>
        <div>
            {reportingState === REPORTING_STATE.PRE_REPORTING && (
              <>
                <LabelValue
                  label='Total Volume'
                  value={volumeFormatted.formatted}
                  condensed
                />
                {!condensed && (
                  <LabelValue
                    label='Open Interest'
                    value={openInterestFormatted.formatted}
                    condensed
                  />
                )}
              </>
            )}
            {reportingState !== REPORTING_STATE.PRE_REPORTING && (
              <LabelValue
                condensed
                label='Total Dispute Stake'
                value={formatAttoRep(disputeInfo.stakeCompletedTotal).formatted}
              />
            )}
            <MarketProgress
              reportingState={reportingState}
              currentTime={currentAugurTimestamp}
              endTimeFormatted={endTimeFormatted}
              reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
              alignRight
            />
          </div>
          <div>
            {marketStatus === MARKET_REPORTING && (
              <InReportingLabel
                marketStatus={marketStatus}
                reportingState={reportingState}
                disputeInfo={disputeInfo}
              />
            )}
            {isTemplate && TemplateIcon}<CategoryTagTrail categories={categoriesWithClick} />
            <MarketProgress
              reportingState={reportingState}
              currentTime={currentAugurTimestamp}
              endTimeFormatted={endTimeFormatted}
              reportingWindowEndTime={disputeInfo.disputeWindow.endTime}
              alignRight
            />
            <div>
              <div>{InfoIcons}</div>
              <FavoritesButton
                action={this.addToFavorites}
                isFavorite={isFavorite}
                hideText
                disabled={!isLogged}
              />
            </div>
            <DotSelection>
              <div id='copy_marketId' data-clipboard-text={id} onClick={() => marketLinkCopied(market.id, MARKET_LIST_CARD)}>
                {PaperClip} {COPY_MARKET_ID}
              </div>
              <div id='copy_author' data-clipboard-text={author}>
                {Person} {COPY_AUTHOR}
              </div>
            </DotSelection>
          </div>

          <MarketTitle id={id} />
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
              />
              {outcomesFormatted &&
                outcomesFormatted.length > showOutcomeNumber &&
                !expandedView && (
                  <button onClick={this.expand}>
                    <ChevronFlip
                      stroke='#fff'
                      pointDown={s.expanded}
                      quick
                      filledInIcon
                      hover
                    />
                    {s.expanded ? 'show less' : 'view all outcomes'}
                  </button>
                )}
            </>
          ) : (
            <div style={{ display: 'none' }}></div>
          )}
          <MigrateMarketNotice marketId={id} />
          {marketResolved && (
            <ResolvedOutcomes
              outcomes={outcomesFormatted}
              expanded={expandedView}
            />
          )}
        </>
        <div>{InfoIcons}</div>

      </div>
    );
  }
}
