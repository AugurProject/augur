import React, { useState } from 'react';
import Media from 'react-media';
import { useLocation } from 'react-router';
import ModuleTabs from 'modules/market/components/common/module-tabs/module-tabs';
import ModulePane from 'modules/market/components/common/module-tabs/module-pane';
import PriceHistory from 'modules/market-charts/components/price-history/price-history';
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
  extendOrders: boolean;
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
  extendOrders = false,
}: MarketChartsPaneProps) => {
  const {
    blockchain: { currentAugurTimestamp: currentTimestamp },
  } = useAppStatusStore();
  const location = useLocation();
  const { creationTime, minPriceBigNumber, maxPriceBigNumber } = market;
  const daysPassed = getMarketAgeInDays(creationTime, currentTimestamp);
  const { preview: initialLiquidity } = getTutorialPreview(marketId, location);
  const minPrice = minPriceBigNumber || ZERO;
  const maxPrice = maxPriceBigNumber || ZERO;
  const [hoveredDepth, updateHoveredDepth] = useState([]);
  const [hoveredPriceProp, updateHoveredPrice] = useState(null);
  const shared = { marketId, selectedOutcomeId, isArchived };
  const onClickCallback = () => extendOutcomesList && toggle();
  const show = !initialLiquidity;
  return (
    <Media query={SMALL_MOBILE}>
      {matches =>
        matches ? (
          <ModuleTabs selected={show ? 0 : 2} fillForMobile>
            <ModulePane label="Candlesticks">
              {show && (
                <Candlestick
                  {...{ ...shared, minPrice, maxPrice, daysPassed }}
                />
              )}
            </ModulePane>
            <ModulePane label="Market Depth">
              <DepthChart
                {...{
                  ...shared,
                  hoveredDepth,
                  hoveredPriceProp,
                  updateHoveredDepth,
                  updateHoveredPrice,
                  market,
                  orderBook,
                  initialLiquidity,
                }}
              />
            </ModulePane>
          </ModuleTabs>
        ) : (
          <ModuleTabs selected={show ? 0 : 2} showToggle toggle={toggle}>
            <ModulePane label="Price History" onClickCallback={onClickCallback}>
              {show && !extendOrders && (
                <PriceHistory {...{ ...shared, market, daysPassed }} />
              )}
            </ModulePane>
            <ModulePane label="Candlesticks" onClickCallback={onClickCallback}>
              {show && !extendOrders && (
                <Candlestick
                  {...{ ...shared, minPrice, maxPrice, daysPassed }}
                />
              )}
            </ModulePane>
            <ModulePane label="Market Depth" onClickCallback={onClickCallback}>
              {!extendOrders && (
                <DepthChart
                  {...{
                    ...shared,
                    hoveredDepth,
                    hoveredPriceProp,
                    updateHoveredDepth,
                    updateHoveredPrice,
                    market,
                    orderBook,
                    initialLiquidity,
                  }}
                />
              )}
            </ModulePane>
          </ModuleTabs>
        )
      }
    </Media>
  );
};

export default MarketChartsPane;
