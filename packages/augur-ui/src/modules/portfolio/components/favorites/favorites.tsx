import React, { Component } from "react";

import FilterBox from "modules/portfolio/containers/filter-box";
import { MarketProgress } from "modules/common/progress";
import { FavoritesButton } from "modules/common/buttons";
import { END_TIME } from "modules/common/constants";

import Styles from "modules/portfolio/components/common/quad.styles.less";
import { MarketData } from "modules/types";

const sortByOptions = [
  {
    label: "Most Recently Added",
    value: "recentlyTraded",
    comp(marketA, marketB) {
      return marketB.favoriteAddedData - marketA.favoriteAddedData;
    }
  },
  {
    label: "Market Creation",
    value: "marketCreation",
    comp(marketA, marketB) {
      return marketB.creationTime - marketA.creationTime;
    }
  },
  {
    label: "Expiring Soonest",
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
  toggle: Function;
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
          reportingWindowEndTime={disputingWindowEndTime}
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
    const { markets, toggle } = this.props;

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
        toggle={toggle}
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
