import React, { useState } from 'react';
import Media from 'react-media';
import { useLocation } from 'react-router';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import PriceHistory from "modules/market-charts/components/price-history/price-history";
import { SMALL_MOBILE, ZERO } from 'modules/common/constants';

import { Candlestick } from 'modules/market-charts/components/candlestick/candlestick';
import DepthChart from 'modules/market-charts/components/depth/depth';
import { MarketData, IndividualOutcomeOrderBook } from 'modules/types';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { getTutorialPreview } from 'modules/market/store/market-utils';
import { getMarketAgeInDays } from 'utils/format-date';

interface MarketChartsPaneProps {
  marketId: string;
  selectedOutcomeId: number;
  market: MarketData;
  toggle: Function;
  orderBook: IndividualOutcomeOrderBook;
  extendOutcomesList: boolean;
  isArchived?: boolean;
}

const MarketChartsPane = ({
  marketId,
  selectedOutcomeId,
  market,
  toggle = () => {},
  isArchived,
  extendOutcomesList,
  orderBook,
}: MarketChartsPaneProps) => {
  const {
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = useAppStatusStore();
  const location = useLocation();
  const { creationTime, minPriceBigNumber, maxPriceBigNumber } = market;
  const daysPassed = getMarketAgeInDays(creationTime, currentTimestamp);
  const { preview } = getTutorialPreview(marketId, location);
  const minPrice = minPriceBigNumber || ZERO;
  const maxPrice = maxPriceBigNumber || ZERO;
  const [hoveredDepth, updateHoveredDepth] = useState([]);
  const [hoveredPrice, updateHoveredPrice] = useState(null);
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
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  daysPassed={daysPassed}
                />
              )}
            </ModulePane>
            <ModulePane label="Market Depth">
              <DepthChart
                {...shared}
                hoveredPriceProp={hoveredPrice}
                hoveredDepth={hoveredDepth}
                updateHoveredDepth={updateHoveredDepth}
                updateHoveredPrice={updateHoveredPrice}
                market={market}
                initialLiquidity={preview}
                orderBook={orderBook}
              />
            </ModulePane>
          </ModuleTabs>
        ) : (
          <ModuleTabs selected={preview ? 2 : 0} showToggle toggle={toggle}>
            <ModulePane
              label="Price History"
              onClickCallback={() => {
                extendOutcomesList && toggle();
              }}
            >
              {!preview && <PriceHistory {...shared} daysPassed={daysPassed} />}
            </ModulePane>
            <ModulePane
              label="Candlesticks"
              onClickCallback={() => {
                extendOutcomesList && toggle();
              }}
            >
              {!preview && (
                <Candlestick
                  {...shared}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  daysPassed={daysPassed}
                />
              )}
            </ModulePane>
            <ModulePane
              label="Market Depth"
              onClickCallback={() => {
                extendOutcomesList && toggle();
              }}
            >
              <DepthChart
                {...shared}
                hoveredPriceProp={hoveredPrice}
                hoveredDepth={hoveredDepth}
                updateHoveredDepth={updateHoveredDepth}
                updateHoveredPrice={updateHoveredPrice}
                market={market}
                initialLiquidity={preview}
                orderBook={orderBook}
              />
            </ModulePane>
          </ModuleTabs>
        )
      }
    </Media>
  );
};

export default MarketChartsPane;