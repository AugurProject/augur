import React, { Component } from "react";
import PropTypes from "prop-types";

import FilterBox from "modules/portfolio/containers/filter-box";
import { LinearPropertyLabel } from "modules/common-elements/labels";
import { MarketProgress } from "modules/common-elements/progress";
import { END_TIME } from "modules/common-elements/constants";

import Styles from "modules/portfolio/components/common/quads/quad.styles";

const sortByOptions = [
  {
    label: "Sort by Expiring Soonest",
    value: END_TIME,
    comp(marketA, marketB) {
      return marketA.endTime.timestamp - marketB.endTime.timestamp;
    }
  },
  {
    label: "Sort by Most Recently Traded",
    value: "recentlyTraded",
    comp(marketA, marketB) {
      return (
        marketB.recentlyTraded.timestamp - marketA.recentlyTraded.timestamp
      );
    }
  },
  {
    label: "Sort by Creation Time",
    value: "creationTime",
    comp(marketA, marketB) {
      return marketB.creationTime.timestamp - marketA.creationTime.timestamp;
    }
  }
];

function filterComp(input, market) {
  return market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

function renderToggleContent(market) {
  return (
    <div className={Styles.Quad__infoParent}>
      <div className={Styles.Quad__infoContainer}>
        <div className={Styles.Quad__info}>
          <LinearPropertyLabel
            label="Volume"
            highlightFirst
            value={`${market.volume.formatted} ETH`}
          />
          <LinearPropertyLabel
            label="Open Interest"
            highlightFirst
            value={`${market.openInterest.formatted} ETH`}
          />
        </div>
      </div>
    </div>
  );
}

class MyMarkets extends Component {
  static propTypes = {
    myMarkets: PropTypes.array.isRequired,
    currentAugurTimestamp: PropTypes.number.isRequired,
    reportingWindowStatsEndTime: PropTypes.number
  };

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
      <MarketProgress
        reportingState={market.reportingState}
        currentTime={currentAugurTimestamp}
        endTime={market.endTime}
        reportingWindowEndtime={reportingWindowStatsEndTime}
      />
    );
  }

  render() {
    const { myMarkets } = this.props;

    return (
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
