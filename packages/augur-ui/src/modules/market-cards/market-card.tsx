import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { CategoryTagTrail, MarketTypeLabel, InReportingLabel } from "modules/common/labels";
import { OutcomeGroup, LabelValue, HoverIcon, ResolvedOutcomes } from "modules/market-cards/common";
import toggleTag from "modules/routes/helpers/toggle-tag";
import toggleCategory from "modules/routes/helpers/toggle-category";
import { MARKETS } from "modules/routes/constants/views";
import makePath from "modules/routes/helpers/make-path";
import MarketLink from "modules/market/components/market-link/market-link";
import { CATEGORICAL, COPY_MARKET_ID, COPY_AUTHOR, REPORTING_STATE } from 'modules/common/constants';
import { FavoritesButton } from "modules/common/buttons";
import Clipboard from "clipboard";
import { DotSelection } from "modules/common/selection";
import { PaperClip, Person, MarketCreator, PositionIcon, DesignatedReporter, DisputeStake } from "modules/common/icons";
import { MarketProgress } from "modules/common/progress";
import ChevronFlip from "modules/common/chevron-flip";
import { MarketData } from "modules/types";
import { formatAttoRep } from "utils/format-number";

import Styles from "modules/market-cards/market-card.styles.less";

interface MarketCardProps {
  market: MarketData;
  isLogged?: Boolean;
  history: object;
  location: object;
  toggleFavorite: Function;
  currentAugurTimestamp: number;
  reportingWindowStatsEndTime: number;
  condensed?: Boolean;
  expandedView?: Boolean;
  address: string;
  loading?: Boolean;
  isFavorite?: Boolean;
  hasPosition?: Boolean;
}

interface MarketCardState {
  expanded: Boolean;
}

export default class MarketCard extends React.Component<
  MarketCardProps,
  MarketCardState
> {
  clipboardMarketId: any = new Clipboard("#copy_marketId");
  clipboardAuthor: any = new Clipboard("#copy_author");
  state: MarketCardState = {
    expanded: false,
  };

  expand = () => {
    this.setState({expanded: !this.state.expanded})
  }

  addToFavorites = () => {
    this.props.toggleFavorite(this.props.market.marketId);
  }

  render() {
    const {
      market,
      location,
      history,
      isLogged,
      currentAugurTimestamp,
      reportingWindowStatsEndTime,
      condensed,
      address,
      expandedView,
      loading,
      isFavorite,
      hasPosition
    } = this.props;

    const s = this.state;

    const {
      description,
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
      tags,
      disputeInfo,
      endTimeFormatted,
      designatedReporter
    } = market;

    if (loading) {
      return (
        <div
        className={classNames(Styles.MarketCard, {[Styles.Loading]: loading})}
      >
        {loading &&
          <>
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
            <div/>
          </>
        }
        </div>
      )
    }

    const path =
    location.pathname === makePath(MARKETS)
      ? location
      : { pathname: makePath(MARKETS) };

    const process = (...arr) =>
      arr.filter(Boolean)
      .map(label => label.toLowerCase())
      .map(label => ({
        label,
        onClick: toggleCategory(label, path, history)
      }));

    const categoriesWithClick = process(categories[0]);
    const tagsWithClick = tags.filter(Boolean)
    .map(tag => tag.toLowerCase())
    .map(tag => ({
      label: tag,
      onClick: toggleTag(tag, path, history),
    }));

    const marketResolved = reportingState === REPORTING_STATE.FINALIZED;

    return (
      <div
        className={classNames(Styles.MarketCard, {[Styles.Loading]: loading})}
      >
          <>
            <div>
              {address && address.toUpperCase() === author.toUpperCase() &&
                <HoverIcon
                  label="marketCreator"
                  icon={MarketCreator}
                  hoverText="Market Creator"
                />
              }
              {address && address.toUpperCase() === designatedReporter.toUpperCase() &&
                <HoverIcon
                  label="reporter"
                  icon={DesignatedReporter}
                  hoverText="Designated Reporter"
                />
              }
              {hasPosition &&
                <HoverIcon
                  label="Position"
                  icon={PositionIcon}
                  hoverText="Position"
                />
              }
              <HoverIcon
                label="dispute"
                icon={DisputeStake}
                hoverText="Dispute Stake"
              />
            </div>
            <div>
              <InReportingLabel
                marketStatus={marketStatus}
                reportingState={reportingState}
                disputeInfo={disputeInfo}
                endTimeFormatted={endTimeFormatted}
                currentAugurTimestamp={currentAugurTimestamp}
                reportingWindowStatsEndTime={reportingWindowStatsEndTime}
              />
              <MarketTypeLabel marketType={marketType} />
              <CategoryTagTrail
                categories={categoriesWithClick}
                tags={tagsWithClick}
              />
              <MarketProgress
                reportingState={reportingState}
                currentTime={currentAugurTimestamp}
                endTimeFormatted={endTimeFormatted}
                reportingWindowEndtime={reportingWindowStatsEndTime}
                alignRight
              />
              <div>
                <FavoritesButton
                  action={this.addToFavorites}
                  isFavorite={isFavorite}
                  hideText
                  disabled={!isLogged}
                />
              </div>
              <DotSelection>
                <div
                  id="copy_marketId"
                  data-clipboard-text={id}
                >
                  {PaperClip} {COPY_MARKET_ID}
                </div>
                <div
                  id="copy_author"
                  data-clipboard-text={author}
                >
                  {Person} {COPY_AUTHOR}
                </div>
              </DotSelection>
            </div>
            <div>
              {reportingState === REPORTING_STATE.PRE_REPORTING &&
                <>
                  <LabelValue
                    label="VOL"
                    value={volumeFormatted.formatted}
                  />
                  {!condensed &&
                    <LabelValue
                      label="OI"
                      value={openInterestFormatted.formatted}
                    />
                  }
                </>
              }
              {reportingState !== REPORTING_STATE.PRE_REPORTING &&
                <LabelValue
                  condensed
                  label="Total Dispute Stake"
                  value={formatAttoRep(disputeInfo.stakeCompletedTotal).formatted}
                />
              }
            </div>

            <MarketLink id={id}>
              {description}
            </MarketLink>
            {!condensed && !marketResolved &&
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
                />
                {marketType === CATEGORICAL && outcomesFormatted.length > 3 && !expandedView &&
                  <button onClick={this.expand}>
                    <ChevronFlip
                      stroke="#fff"
                      pointDown={s.expanded}
                      quick
                      filledInIcon
                      hover
                    />
                    {s.expanded ? "show less" : "view all outcomes"}
                  </button>
                }
              </>
            }
            {marketResolved &&
              <ResolvedOutcomes
                outcomes={o}
                expanded={expandedView}
              />
            }
          </>
      </div>
    );
  }
}
