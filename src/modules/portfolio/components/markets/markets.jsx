import React, { Component } from "react";
import PropTypes from "prop-types";

import FilterBox from "modules/portfolio/containers/filter-box";
import { LinearPropertyLabel } from "modules/common-elements/labels";
import { MarketProgress } from "modules/common-elements/progress";

import Styles from "modules/portfolio/components/common/quads/quad.styles";

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
    this.createSortByOptions = this.createSortByOptions.bind(this);
  }

  createSortByOptions() {
    const { currentAugurTimestamp } = this.props;
    const sortByOptions = [
      {
        label: "Sort by Expiring Soonest",
        value: "endTime",
        comp(marketA, marketB) {
          if (
            marketA.endTime.timestamp < currentAugurTimestamp &&
            marketB.endTime.timestamp < currentAugurTimestamp
          ) {
            return marketB.endTime.timestamp - marketA.endTime.timestamp;
          }
          if (marketA.endTime.timestamp < currentAugurTimestamp) {
            return 1;
          }
          if (marketB.endTime.timestamp < currentAugurTimestamp) {
            return -1;
          }
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
          return (
            marketB.creationTime.timestamp - marketA.creationTime.timestamp
          );
        }
      }
    ];

    return sortByOptions;
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

    const sortByOptions = this.createSortByOptions();

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
