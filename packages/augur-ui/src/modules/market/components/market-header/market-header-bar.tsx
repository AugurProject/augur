import React, { Component } from "react";
import Styles from "modules/market/components/market-header/market-header-bar.styles.less";
import { InReportingLabel } from "modules/common/labels";
import { MARKET_OPEN, REPORTING_STATE } from "modules/common/constants";
import { DateFormattedObject } from "modules/types";
import { Getters } from "@augurproject/sdk";

export interface MarketHeaderBarProps {
  marketStatus: string;
  reportingState: string;
  disputeInfo: Getters.Markets.DisputeInfo;
  endTimeFormatted: DateFormattedObject;
  currentAugurTimestamp: number;
}

class MarketHeaderBar extends Component<MarketHeaderBarProps> {
  render() {
    const {
      marketStatus,
      reportingState,
      disputeInfo,
      endTimeFormatted,
      currentAugurTimestamp,
    } = this.props;

    return (
      <section className={Styles.HeaderBar}>
        <InReportingLabel
          marketStatus={marketStatus || MARKET_OPEN}
          reportingState={reportingState || REPORTING_STATE.PRE_REPORTING}
          disputeInfo={disputeInfo}
          endTimeFormatted={endTimeFormatted}
          currentAugurTimestamp={currentAugurTimestamp}
        />
      </section>
    );
  }
}

export default MarketHeaderBar;
