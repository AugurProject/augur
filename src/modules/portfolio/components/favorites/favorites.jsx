import React, { Component } from "react";
import PropTypes from "prop-types";

import FilterBox from "modules/portfolio/containers/filter-box";
import { MarketProgress } from "modules/common-elements/progress";
import { FavoritesButton } from "modules/common-elements/buttons";

import Styles from "modules/portfolio/components/common/quads/quad.styles";

const sortByOptions = [
  {
    label: "Sort by Most Recently Added",
    value: "recentlyTraded",
    comp(marketA, marketB) {
      return marketB.favoriteAddedData - marketA.favoriteAddedData;
    }
  },
  {
    label: "Sort by Market Creation",
    value: "marketCreation",
    comp(marketA, marketB) {
      return marketB.creationTime.timestamp - marketA.creationTime.timestamp;
    }
  },
  {
    label: "Sort by Expiring Soonest",
    value: "endTime",
    comp(marketA, marketB) {
      return marketA.endTime.timestamp - marketB.endTime.timestamp;
    }
  }
];

function filterComp(input, market) {
  return market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export default class Favorites extends Component {
  static propTypes = {
    markets: PropTypes.array.isRequired,
    currentAugurTimestamp: PropTypes.number.isRequired,
    reportingWindowStatsEndTime: PropTypes.number.isRequired,
    toggleFavorite: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.renderRightContent = this.renderRightContent.bind(this);
  }

  renderRightContent(market) {
    const {
      currentAugurTimestamp,
      reportingWindowStatsEndTime,
      toggleFavorite
    } = this.props;

    return (
      <div className={Styles.Quads__multiRightContent}>
        <MarketProgress
          reportingState={market.reportingState}
          currentTime={currentAugurTimestamp}
          endTime={market.endTime}
          reportingWindowEndtime={reportingWindowStatsEndTime}
        />
        <FavoritesButton
          action={() => toggleFavorite(market.id)}
          isFavorite
          hideText
          isSmall
        />
      </div>
    );
  }

  render() {
    const { markets } = this.props;

    return (
      <FilterBox
        title="Watchlist"
        sortByOptions={sortByOptions}
        sortByStyles={{ minWidth: "10.625rem" }}
        markets={markets}
        filterComp={filterComp}
        renderRightContent={this.renderRightContent}
        noToggle
        filterLabel="markets"
        pickVariables={[
          "id",
          "favoriteAddedData",
          "description",
          "reportingState",
          "endTime",
          "creationTime"
        ]}
      />
    );
  }
}
