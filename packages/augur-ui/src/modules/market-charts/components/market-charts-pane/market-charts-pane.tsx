import React, { Component } from 'react';
import Media from 'react-media';

import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import PriceHistory from 'modules/market-charts/containers/price-history';
import { SMALL_MOBILE } from 'modules/common/constants';

import { Candlestick } from 'modules/market-charts/components/candlestick/candlestick';
import DepthChart from 'modules/market-charts/containers/depth';
import { BigNumber } from 'bignumber.js';
import { MarketData, IndividualOutcomeOrderBook } from 'modules/types';

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
  toggle: Function;
  tradingTutorial?: boolean;
  orderBook: IndividualOutcomeOrderBook;
  extendOutcomesList: boolean;
  isArchived?: boolean;
}

interface MarketChartsPaneState {
  hoveredPrice: null | BigNumber;
  hoveredDepth: any[];
}

export default class MarketChartsPane extends Component<
  MarketChartsPaneProps,
  MarketChartsPaneState
> {
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
      market,
      toggle,
      orderBook,
      isArchived,
      extendOutcomesList,
    } = this.props;
    const { hoveredPrice, hoveredDepth } = this.state;
    const shared = { marketId, selectedOutcomeId, isArchived };

    return (
      <Media query={SMALL_MOBILE}>
        {matches =>
          matches ? (
            <ModuleTabs selected={preview ? 2 : 0} fillForMobile>
              <ModulePane label="Candlesticks">
                {!preview && (
                  <Candlestick
                    {...shared}
                    currentTimeInSeconds={currentTimestamp}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    daysPassed={daysPassed}
                  />
                )}
              </ModulePane>
              <ModulePane label="Market Depth">
                <DepthChart
                  {...shared}
                  updateSelectedOrderProperties={updateSelectedOrderProperties}
                  hoveredPrice={hoveredPrice}
                  hoveredDepth={hoveredDepth}
                  updateHoveredDepth={this.updateHoveredDepth}
                  updateHoveredPrice={this.updateHoveredPrice}
                  market={preview && market}
                  initialLiquidity={preview}
                  orderBook={orderBook}
                />
              </ModulePane>
            </ModuleTabs>
          ) : (
            <ModuleTabs selected={preview ? 2 : 0} showToggle toggle={toggle}>
              <ModulePane label="Price History"
                  onClickCallback={() => {
                    extendOutcomesList && toggle && toggle();
                  }
                }>
                {!preview && (
                  <PriceHistory
                    {...shared}
                    daysPassed={daysPassed}
                  />
                )}
              </ModulePane>
              <ModulePane label="Candlesticks"
                onClickCallback={() => {
                    extendOutcomesList && toggle && toggle();
                  }
                }>
                {!preview && (
                  <Candlestick
                    {...shared}
                    currentTimeInSeconds={currentTimestamp}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    daysPassed={daysPassed}
                  />
                )}
              </ModulePane>
              <ModulePane label="Market Depth"
                onClickCallback={() => {
                    extendOutcomesList && toggle && toggle();
                  }
                }>
                <DepthChart
                  {...shared}
                  updateSelectedOrderProperties={updateSelectedOrderProperties}
                  hoveredPrice={hoveredPrice}
                  hoveredDepth={hoveredDepth}
                  updateHoveredDepth={this.updateHoveredDepth}
                  updateHoveredPrice={this.updateHoveredPrice}
                  market={preview && market}
                  initialLiquidity={preview}
                  orderBook={orderBook}
                />
              </ModulePane>
            </ModuleTabs>
          )
        }
      </Media>
    );
  }
}
