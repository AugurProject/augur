import React, { Component } from "react";
import Styles from "modules/market/components/market-header/market-header-bar.styles.less";
import { FavoritesButton } from "modules/common/buttons";
import { InReportingLabel } from "modules/common/labels";
import { PaperClip, Person } from "modules/common/icons";
import * as constants from "modules/common/constants";
import Clipboard from "clipboard";
import { DotSelection } from "modules/common/selection";
import { DateFormattedObject } from "modules/types";

export interface MarketHeaderBarProps {
  addToFavorites: Function;
  author: string;
  marketId: string;
  marketStatus: string;
  isLogged: boolean;
  isFavorite: boolean;
  reportingState: string;
  disputeInfo: any;
  endTimeFormatted: DateFormattedObject;
  currentAugurTimestamp: number;
  reportingWindowStatsEndTime: number;
}

class MarketHeaderBar extends Component<MarketHeaderBarProps> {
  clipboardMarketId: any = new Clipboard("#copy_marketId");
  clipboardAuthor: any = new Clipboard("#copy_author");

  render() {
    const {
      author,
      addToFavorites,
      isLogged,
      isFavorite,
      marketId,
      marketStatus,
      reportingState,
      disputeInfo,
      endTimeFormatted,
      currentAugurTimestamp,
      reportingWindowStatsEndTime,
    } = this.props;

    return (
      <section className={Styles.HeaderBar}>
        <InReportingLabel
          marketStatus={marketStatus}
          reportingState={reportingState}
          disputeInfo={disputeInfo}
          endTime={endTimeFormatted}
          currentAugurTimestamp={currentAugurTimestamp}
          reportingWindowStatsEndTime={reportingWindowStatsEndTime}
        />

        {addToFavorites && (
          <div>
            <FavoritesButton
              action={() => addToFavorites()}
              isFavorite={isFavorite}
              hideText
              disabled={!isLogged}
            />
          </div>
        )}
        <DotSelection>
          <div
            id="copy_marketId"
            data-clipboard-text={marketId}
          >
            {PaperClip} {constants.COPY_MARKET_ID}
          </div>
          <div
            id="copy_author"
            data-clipboard-text={author}
          >
            {Person} {constants.COPY_AUTHOR}
          </div>
        </DotSelection>
      </section>
    );
  }
}

export default MarketHeaderBar;
