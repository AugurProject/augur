import React, { Component } from "react";
import Styles from "modules/market/components/market-header/market-header-bar.styles";
import { FavoritesButton } from "modules/common-elements/buttons";
import { InReportingLabel } from "modules/common-elements/labels";
import { PaperClip, Person } from "modules/common-elements/icons";
import * as constants from "modules/common-elements/constants";
import Clipboard from "clipboard";
import { DotSelection } from "modules/common-elements/selection";

export interface MarketHeaderBarProps {
  addToFavorites: Function;
  author: string;
  marketId: string;
  marketStatus: string;
  isLogged: boolean;
  isFavorite: boolean;
  reportingState: string;
  disputeInfo: any;
  endTime: number;
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
      endTime,
      currentAugurTimestamp,
      reportingWindowStatsEndTime
    } = this.props;
    return (
      <section className={Styles.MarketHeaderBar}>
        <InReportingLabel
          marketStatus={marketStatus}
          reportingState={reportingState}
          disputeInfo={disputeInfo}
          endTime={endTime}
          currentAugurTimestamp={currentAugurTimestamp}
          reportingWindowStatsEndTime={reportingWindowStatsEndTime}
        />

        {addToFavorites && (
          <div className={Styles.MarketHeaderBar__watchlist__container}>
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
            className={Styles.MarketHeaderBar_menuItem}
            id="copy_marketId"
            data-clipboard-text={marketId}
          >
            {PaperClip} {constants.COPY_MARKET_ID}
          </div>
          <div
            className={Styles.MarketHeaderBar_menuItem}
            id="copy_author"
            data-clipboard-text={author}
          >
            {Person} {constants.COPY_AURTHOR}
          </div>
        </DotSelection>
      </section>
    );
  }
}

export default MarketHeaderBar;
