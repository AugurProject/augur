import React, { Component } from "react";
import Media from "react-media";

import ModuleTabs from "modules/market/components/common/module-tabs/module-tabs";
import ModulePane from "modules/market/components/common/module-tabs/module-pane";
import MarketOutcomesChart from "modules/market-charts/containers/market-outcomes-chart";
import { TEMP_TABLET } from "modules/common/constants";

import { Candlestick } from "modules/market/components/market-view-charts/candlestick";
import MarketDepth from "modules/market-charts/containers/market-outcome-chart-depth";
import { BigNumber } from "bignumber.js";
import { MarketData } from "modules/types";

interface MarketChartsPaneProps {
  currentTimestamp?: number | undefined;
  marketId: string;
  maxPrice: BigNumber;
  minPrice: BigNumber;
  selectedOutcomeId: number;
  updateSelectedOrderProperties: Function;
  daysPassed?: number;
  preview?: Boolean;
  market?: MarketData;
}

interface MarketChartsPaneState {
  hoveredPrice: null | BigNumber;
  hoveredDepth: Array<any>;
}

export default class MarketChartsPane extends Component<MarketChartsPaneProps, MarketChartsPaneState> {
  static defaultProps = {
    currentTimestamp: 0,
    daysPassed: 0,
  };

  constructor(props) {
    super(props);

    this.state = {
      hoveredDepth: [],
      hoveredPrice: null,
    };
    this.updateHoveredPrice = this.updateHoveredPrice.bind(this);
    this.updateHoveredDepth = this.updateHoveredDepth.bind(this);
  }

  updateHoveredDepth(hoveredDepth) {
    this.setState({
      hoveredDepth,
    });
  }

  updateHoveredPrice(hoveredPrice) {
    this.setState({
      hoveredPrice,
    });
  }

  render() {
    const {
      currentTimestamp,
      marketId,
      selectedOutcomeId,
      maxPrice,
      minPrice,
      updateSelectedOrderProperties,
      daysPassed,
      preview,
      market
    } = this.props;
    const s = this.state;

    return (
      <Media query={TEMP_TABLET}>
      {(matches) =>
        matches ? (
          <ModuleTabs selected={preview ? 2 : 0} fillForMobile>
            <ModulePane label="Candlesticks">
              {!preview &&
                <Candlestick
                  currentTimeInSeconds={currentTimestamp}
                  marketId={marketId}
                  selectedOutcomeId={selectedOutcomeId}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  daysPassed={daysPassed}
                  isMobile
                />
              }
            </ModulePane>
            <ModulePane label="Market Depth">
              <MarketDepth
                marketId={marketId}
                selectedOutcomeId={selectedOutcomeId}
                updateSelectedOrderProperties={updateSelectedOrderProperties}
                hoveredPrice={s.hoveredPrice}
                hoveredDepth={s.hoveredDepth}
                updateHoveredDepth={this.updateHoveredDepth}
                updateHoveredPrice={this.updateHoveredPrice}
                market={preview && market}
                initialLiquidity={preview}
              />
            </ModulePane>
          </ModuleTabs>
        ) : (
          <ModuleTabs selected={preview ? 2 : 0}>
            <ModulePane label="Price History">
              {!preview && 
                <MarketOutcomesChart
                  marketId={marketId}
                  selectedOutcomeId={selectedOutcomeId}
                />
              }
            </ModulePane>
            <ModulePane label="Candlesticks">
              {!preview &&
                <Candlestick
                  currentTimeInSeconds={currentTimestamp}
                  marketId={marketId}
                  selectedOutcomeId={selectedOutcomeId}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  daysPassed={daysPassed}
                />
              }
            </ModulePane>
            <ModulePane label="Market Depth">
              <MarketDepth
                marketId={marketId}
                selectedOutcomeId={selectedOutcomeId}
                updateSelectedOrderProperties={updateSelectedOrderProperties}
                hoveredPrice={s.hoveredPrice}
                hoveredDepth={s.hoveredDepth}
                updateHoveredDepth={this.updateHoveredDepth}
                updateHoveredPrice={this.updateHoveredPrice}
                market={preview && market}
                initialLiquidity={preview}
              />
            </ModulePane>
          </ModuleTabs>
        )
      }
      </Media>
    );
  }
}
