import React, { Component } from "react";
import PropTypes from "prop-types";

import FilterBox from "modules/portfolio/containers/filter-box";
import { CompactButton } from "modules/common/buttons";
import { MovementLabel } from "modules/common/labels";
import PositionsTable from "modules/market/containers/positions-table";
import { END_TIME } from "modules/common/constants";

import Styles from "modules/portfolio/components/common/quad.styles.less";
import { MarketData } from "modules/types";

const sortByOptions = [
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
    label: "Sort by Current Value",
    value: "currentValue",
    comp(marketA, marketB) {
      return (
        marketB.myPositionsSummary.currentValue.formatted -
        marketA.myPositionsSummary.currentValue.formatted
      );
    }
  },
  {
    label: "Sort by Total Returns",
    value: "totalReturns",
    comp(marketA, marketB) {
      return (
        marketB.myPositionsSummary.totalReturns.formatted -
        marketA.myPositionsSummary.totalReturns.formatted
      );
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
  return market && market.description ? market.description.toLowerCase().indexOf(input.toLowerCase()) >= 0 : true;
}

function renderToggleContent(market) {
  return <PositionsTable market={market} />;
}

interface PositionsProps {
  markets: Array<MarketData>;
}

interface PositionsState {
  showCurrentValue: boolean;
}

export default class Positions extends Component<PositionsProps, PositionsState> {
  constructor(props) {
    super(props);

    this.state = {
      showCurrentValue: false,
    };

    this.updateRightContentValue = this.updateRightContentValue.bind(this);
    this.renderRightContent = this.renderRightContent.bind(this);
  }

  updateRightContentValue() {
    this.setState({ showCurrentValue: !this.state.showCurrentValue });
  }

  renderRightContent(market) {
    const { showCurrentValue } = this.state;

    return showCurrentValue ? (
      market.myPositionsSummary.currentValue.formatted
    ) : (
      <div className={Styles.Column}>
        <span>{market.myPositionsSummary.totalReturns.formatted}</span>
        <MovementLabel
          showPercent
          showPlusMinus
          showColors
          size="small"
          value={market.myPositionsSummary.totalPercent.formatted}
        />
      </div>
    );
  }

  render() {
    const { markets } = this.props;
    const { showCurrentValue } = this.state;

    return (
      <FilterBox
        sortByStyles={{ minWidth: "10.8125rem" }}
        title="Positions"
        sortByOptions={sortByOptions}
        markets={markets}
        filterComp={filterComp}
        bottomRightContent={
          <CompactButton
            text={showCurrentValue ? "Current Value" : "Total Returns"}
            action={this.updateRightContentValue}
          />
        }
        renderRightContent={this.renderRightContent}
        renderToggleContent={renderToggleContent}
        filterLabel="positions"
        pickVariables={[
          "id",
          "description",
          "reportingState",
          "myPositionsSummary",
          "recentlyTraded",
          "endTime",
        ]}
      />
    );
  }
}
