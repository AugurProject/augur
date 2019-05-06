import React, { Component } from "react";
import * as PropTypes from "prop-types";

import ModuleTabs from "modules/market/components/common/module-tabs/module-tabs";
import ModulePane from "modules/market/components/common/module-tabs/module-pane";
import MarketOutcomesChart from "src/modules/market-charts/containers/market-outcomes-chart";

import { Candlestick } from "src/modules/market/components/market-view-charts/candlestick";
import MarketDepth from "modules/market-charts/containers/market-outcome-chart-depth";
import { BigNumber } from "bignumber.js";

export default class MarketChartsPane extends Component {
  static propTypes = {
    currentTimestamp: PropTypes.number,
    marketId: PropTypes.string.isRequired,
    maxPrice: PropTypes.instanceOf(BigNumber).isRequired,
    minPrice: PropTypes.instanceOf(BigNumber).isRequired,
    selectedOutcome: PropTypes.string.isRequired,
    updateSelectedOrderProperties: PropTypes.func.isRequired,
    isMobile: PropTypes.bool,
    daysPassed: PropTypes.number
  };

  static defaultProps = {
    isMobile: false,
    currentTimestamp: 0,
    daysPassed: 0
  };

  constructor(props) {
    super(props);

    this.state = {
      hoveredDepth: [],
      hoveredPrice: null
    };
    this.updateHoveredPrice = this.updateHoveredPrice.bind(this);
    this.updateHoveredDepth = this.updateHoveredDepth.bind(this);
  }

  updateHoveredDepth(hoveredDepth) {
    this.setState({
      hoveredDepth
    });
  }

  updateHoveredPrice(hoveredPrice) {
    this.setState({
      hoveredPrice
    });
  }

  render() {
    const {
      currentTimestamp,
      marketId,
      selectedOutcome,
      maxPrice,
      minPrice,
      updateSelectedOrderProperties,
      isMobile,
      daysPassed
    } = this.props;
    const s = this.state;

    if (isMobile) {
      return (
        <ModuleTabs selected={0} fillForMobile>
          <ModulePane label="Candlesticks">
            <Candlestick
              currentTimeInSeconds={currentTimestamp}
              marketId={marketId}
              selectedOutcome={selectedOutcome}
              minPrice={minPrice}
              maxPrice={maxPrice}
              daysPassed={daysPassed}
              isMobile={isMobile}
            />
          </ModulePane>
          <ModulePane
            ref={ordersContainer => {
              this.ordersContainer = ordersContainer;
            }}
            label="Market Depth"
          >
            <MarketDepth
              marketId={marketId}
              selectedOutcome={selectedOutcome}
              updateSelectedOrderProperties={updateSelectedOrderProperties}
              hoveredPrice={s.hoveredPrice}
              hoveredDepth={s.hoveredDepth}
              updateHoveredDepth={this.updateHoveredDepth}
              updateHoveredPrice={this.updateHoveredPrice}
            />
          </ModulePane>
        </ModuleTabs>
      );
    }

    return (
      <ModuleTabs selected={0} borderBetween>
        <ModulePane label="Price History">
          <MarketOutcomesChart
            marketId={marketId}
            selectedOutcome={selectedOutcome}
            pricePrecision={4}
            daysPassed={daysPassed}
          />
        </ModulePane>
        <ModulePane label="Candlesticks">
          <Candlestick
            currentTimeInSeconds={currentTimestamp}
            marketId={marketId}
            selectedOutcome={selectedOutcome}
            minPrice={minPrice}
            maxPrice={maxPrice}
            daysPassed={daysPassed}
            isMobile={isMobile}
          />
        </ModulePane>
        <ModulePane
          ref={ordersContainer => {
            this.ordersContainer = ordersContainer;
          }}
          label="Market Depth"
        >
          <MarketDepth
            marketId={marketId}
            selectedOutcome={selectedOutcome}
            updateSelectedOrderProperties={updateSelectedOrderProperties}
            hoveredPrice={s.hoveredPrice}
            hoveredDepth={s.hoveredDepth}
            updateHoveredDepth={this.updateHoveredDepth}
            updateHoveredPrice={this.updateHoveredPrice}
          />
        </ModulePane>
      </ModuleTabs>
    );
  }
}
