import React, { Component } from "react";

import FilterBox from "modules/portfolio/containers/filter-box";
import { CompactButton } from "modules/common/buttons";
import { MovementLabel } from "modules/common/labels";
import PositionsTable from "modules/market/containers/positions-table";
import { END_TIME } from "modules/common/constants";

import Styles from "modules/portfolio/components/common/quad.styles.less";
import { MarketData, SizeTypes } from "modules/types";

const sortByOptions = [
  {
    label: "Most Recently Traded",
    value: "recentlyTraded",
    comp(marketA, marketB) {
      return (
        marketB.recentlyTraded.timestamp - marketA.recentlyTraded.timestamp
      );
    }
  },
  {
    label: "Current Value",
    value: "currentValue",
    comp(marketA, marketB) {
      return (
        marketB.myPositionsSummary.currentValue.formatted -
        marketA.myPositionsSummary.currentValue.formatted
      );
    }
  },
  {
    label: "Total Returns",
    value: "totalReturns",
    comp(marketA, marketB) {
      return (
        marketB.myPositionsSummary.totalReturns.formatted -
        marketA.myPositionsSummary.totalReturns.formatted
      );
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

function renderToggleContent(market) {
  return <PositionsTable market={market} />;
}

interface PositionsProps {
  markets: MarketData[];
  toggle: Function;
  hide: boolean;
  extend: boolean;
}

interface PositionsState {
  showCurrentValue: boolean;
}

export default class Positions extends Component<PositionsProps, PositionsState> {
  state = {
    showCurrentValue: false,
  };

  constructor(props) {
    super(props);


    this.updateRightContentValue = this.updateRightContentValue.bind(this);
    this.renderRightContent = this.renderRightContent.bind(this);
  }

  updateRightContentValue() {
    this.setState({ showCurrentValue: !this.state.showCurrentValue });
  }

  renderRightContent(market) {
    const { showCurrentValue } = this.state;

    return showCurrentValue ? (
      `$${market.myPositionsSummary && market.myPositionsSummary.currentValue.formatted}`
    ) : (
        <div className={Styles.Column}>
          <span>${market.myPositionsSummary && market.myPositionsSummary.totalReturns.formatted}</span>
          <MovementLabel
            showPercent
            showPlusMinus
            showColors
            showBrackets
            size={SizeTypes.SMALL}
            value={market.myPositionsSummary && market.myPositionsSummary.totalPercent.formatted}
          />
        </div>
      );
  }

  render() {
    const { markets, toggle, hide, extend } = this.props;
    const { showCurrentValue } = this.state;

    return (
      <FilterBox
        sortByStyles={{ minWidth: "10.8125rem" }}
        title="Positions"
        sortByOptions={sortByOptions}
        markets={markets}
        filterComp={filterComp}
        toggle={toggle}
        hide={hide}
        extend={extend}
        bottomRightContent={
          <CompactButton
            text={showCurrentValue ? "Current Value" : "Display Total Returns"}
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
