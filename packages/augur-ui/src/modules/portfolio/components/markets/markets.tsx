import React, { Component } from "react";
import PropTypes from "prop-types";

import FilterBox from "modules/portfolio/containers/filter-box";
import { LinearPropertyLabel, PendingLabel } from "modules/common/labels";
import { MarketProgress } from "modules/common/progress";
import { END_TIME } from "modules/common/constants";
import { TXEventName } from '@augurproject/sdk';

import Styles from "modules/portfolio/components/common/quad.styles.less";
import { MarketData } from "modules/types";

const sortByOptions = [
  {
    label: "Sort by Expiring Soonest",
    value: END_TIME,
    comp(marketA, marketB) {
      if (marketA.pending) return 1;
      if (marketB.pending) return 0;
      return marketA.endTime.timestamp - marketB.endTime.timestamp;
    },
  },
  {
    label: "Sort by Most Recently Traded",
    value: "recentlyTraded",
    comp(marketA, marketB) {
      return (
        marketB.recentlyTraded.timestamp - marketA.recentlyTraded.timestamp
      );
    },
  },
  {
    label: "Sort by Creation Time",
    value: "creationTime",
    comp(marketA, marketB) {
      return marketB.creationTime.timestamp - marketA.creationTime.timestamp;
    },
  },
];

function filterComp(input, market) {
  if (!market) return false;
  return market.description ? market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0 : true;
}

function renderToggleContent(market) {
  return (
    <div className={Styles.InfoParent}>
        <div>
          {!market.pending &&
            <div>
              <LinearPropertyLabel
                label="Volume"
                highlightFirst
                value={`${market.volumeFormatted.formatted} DAI`}
              />
              <LinearPropertyLabel
                label="Open Interest"
                highlightFirst
                value={`${market.openInterestFormatted.formatted} DAI`}
              />
            </div>
          }
          {market.pending && market.status === TXEventName.Pending &&
            <span>You will receive an alert and notification when your market has been processed. </span>
          }
        </div>
    </div>
  );
}

interface MyMarketsProps {
  myMarkets: Array<MarketData>;
  currentAugurTimestamp: number;
  reportingWindowStatsEndTime: number;
}

class MyMarkets extends Component<MyMarketsProps> {
  static defaultProps = {
    reportingWindowStatsEndTime: 0,
    currentAugurTimestamp: 0
  };

  constructor(props) {
    super(props);

    this.renderRightContent = this.renderRightContent.bind(this);
  }

  renderRightContent(market) {
    const { currentAugurTimestamp, reportingWindowStatsEndTime } = this.props;

    return (
      <>
        {market.pending && 
          <PendingLabel />
        }
        {!market.pending && 
          <MarketProgress
            reportingState={market.reportingState}
            currentTime={currentAugurTimestamp}
            endTimeFormatted={market.endTimeFormatted}
            reportingWindowEndtime={reportingWindowStatsEndTime}
            alignRight
          />
        }
      </>
    );
  }

  render() {
    const { myMarkets } = this.props;

    return (
      // @ts-ignore
      <FilterBox
        title="My Created Markets"
        sortByOptions={sortByOptions}
        sortByStyles={{ minWidth: "10.8125rem" }}
        markets={myMarkets}
        filterComp={filterComp}
        renderRightContent={this.renderRightContent}
        renderToggleContent={renderToggleContent}
        filterLabel="markets"
        pickVariables={[
          "id",
          "description",
          "reportingState",
          "recentlyTraded",
          "creationTime",
          "endTime"
        ]}
      />
    );
  }
}

export default MyMarkets;
