import React, { Component } from "react";
import PropTypes from "prop-types";

import FilterBox from "modules/portfolio/containers/filter-box";
import { MarketProgress } from "modules/common/progress";
import { FavoritesButton } from "modules/common/buttons";
import { END_TIME } from "modules/common/constants";

import Styles from "modules/portfolio/components/common/quad.styles.less";
import { MarketData } from "modules/types";
import { convertUnixToFormattedDate } from "utils/format-date";

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
    value: END_TIME,
    comp(marketA, marketB) {
      return marketA.endTime.timestamp - marketB.endTime.timestamp;
    }
  }
];

function filterComp(input, market) {
  if (!market) return false;
  return market.description ? market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0 : true;

}

interface FavoritesProps {
  markets: Array<MarketData>;
  currentAugurTimestamp: number;
  disputingWindowEndTime: number;
  toggleFavorite: Function;
}

export default class Favorites extends Component<FavoritesProps> {
  static defaultProps = {
    currentAugurTimestamp: 0,
    disputingWindowEndTime: 0,
  };

  constructor(props) {
    super(props);

    this.renderRightContent = this.renderRightContent.bind(this);
  }

  renderRightContent(market) {
    const {
      currentAugurTimestamp,
      disputingWindowEndTime,
      toggleFavorite,
    } = this.props;

    return (
      <div className={Styles.MultiColumn}>
        <MarketProgress
          reportingState={market.reportingState}
          currentTime={currentAugurTimestamp}
          endTimeFormatted={market.endTimeFormatted}
          reportingWindowEndtime={disputingWindowEndTime}
          alignRight
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
