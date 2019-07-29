import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { CategoryTagTrail, MarketTypeLabel, InReportingLabel } from "modules/common/labels";
import { OutcomeGroup, LabelValue, HoverIcon } from "modules/market-cards/common";
import toggleTag from "modules/routes/helpers/toggle-tag";
import toggleCategory from "modules/routes/helpers/toggle-category";
import { MARKETS } from "modules/routes/constants/views";
import makePath from "modules/routes/helpers/make-path";
import MarketLink from "modules/market/components/market-link/market-link";
import { CATEGORICAL, COPY_MARKET_ID, COPY_AUTHOR } from 'modules/common/constants';
import { FavoritesButton } from "modules/common/buttons";
import Clipboard from "clipboard";
import { DotSelection } from "modules/common/selection";
import { DateFormattedObject } from "modules/types";
import { PaperClip, Person, MarketCreator, PositionIcon, DesignatedReporter, DisputeStake } from "modules/common/icons";
import { MarketProgress } from "modules/common/progress";
import ChevronFlip from "modules/common/chevron-flip";

import Styles from "modules/market-cards/market-card.styles";

interface MarketCardProps {
  market: Object;
  isLogged?: Boolean;
  history: object;
  location: object;
  toggleFavorite: Function;
  currentAugurTimestamp: number;
  reportingWindowStatsEndTime: number;
  condensed?: Boolean;
  expandedView?: Boolean;
  address: string;
}

interface MarketCardState {
  expanded: Boolean;
}

export default class MarketCard extends React.Component<
  MarketCardProps,
  MarketCardState
> {
  state: FormDetailsState = {
    expanded: false,
  };

  expand = () => {
    this.setState({expanded: !this.state.expanded})
  }

  render() {
    const {
      market,
      location,
      history,
      isLogged,
      toggleFavorite,
      currentAugurTimestamp,
      reportingWindowStatsEndTime,
      condensed,
      address,
      expandedView
    } = this.props;

    const s = this.state;

    const {
      description,
      outcomesFormatted,
      marketType,
      scalarDenomination,
      minPrice,
      maxPrice,
      categories,
      id,
      marketStatus,
      isFavorite,
      author,
      reportingState,
      endTime,
      openInterestFormatted,
      volumeFormatted,
      tags,
      disputeInfo,
      endTimeFormatted
    } = market;

    const path =
    location.pathname === makePath(MARKETS)
      ? location
      : { pathname: makePath(MARKETS) };

    const process = (...arr) =>
      arr.filter(Boolean).map(label => ({
        label,
        onClick: toggleCategory(label, path, history)
      }));

    const categoriesWithClick = process(categories[0]);
    const tagsWithClick = tags.filter(Boolean).map(tag => ({
      label: tag,
      onClick: toggleTag(tag, path, history)
    }));

    return (
      <div 
        className={Styles.MarketCard}
      >
        <div>
          {address === author &&
            <HoverIcon
              label="marketCreator"
              icon={MarketCreator}
              hoverText="Market Creator"
            />
          }
          <HoverIcon
            label="reporter"
            icon={DesignatedReporter}
            hoverText="Designated Reporter"
          />
          <HoverIcon
            label="Position"
            icon={PositionIcon}
            hoverText="Position"
          />
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
            endTime={endTimeFormatted}
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
            endTime={endTime}
            reportingWindowEndtime={reportingWindowStatsEndTime}
            alignRight
          />
          {toggleFavorite && (
            <div>
              <FavoritesButton
                action={() => toggleFavorite()}
                isFavorite={isFavorite}
                hideText
                disabled={!isLogged}
              />
            </div>
          )}
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
        </div>
        
        <MarketLink id={id}>
          {description}
        </MarketLink>
        {!condensed && 
          <>
            <OutcomeGroup 
              outcomes={outcomesFormatted} 
              marketType={marketType}
              scalarDenomination={scalarDenomination}
              min={minPrice}
              max={maxPrice}
              lastPrice={0}
              expanded={expandedView ? true : s.expanded}
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
      </div>
    );
  }
}
