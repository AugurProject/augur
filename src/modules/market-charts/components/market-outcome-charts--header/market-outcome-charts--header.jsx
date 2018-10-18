import React from "react";
import PropTypes from "prop-types";

import MarketOutcomeChartsHeaderCandlestick from "modules/market-charts/components/market-outcome-charts--header-candlestick/market-outcome-charts--header-candlestick";
import MarketOutcomeChartHeaderDepth from "modules/market-charts/components/market-outcome-charts--header-depth/market-outcome-charts--header-depth";
import MarketOutcomeChartHeaderOrders from "modules/market-charts/components/market-outcome-charts--header-orders/market-outcome-charts--header-orders";

import Styles from "modules/market-charts/components/market-outcome-charts--header/market-outcome-charts--header.styles";

const MarketOutcomeChartsHeader = ({
  outcomeName,
  hoveredPeriod,
  hoveredDepth,
  fixedPrecision,
  updatePrecision,
  updateSelectedPeriod,
  priceTimeSeries,
  excludeCandlestick
}) => (
  <section className={Styles.MarketOutcomeChartsHeader}>
    {excludeCandlestick || (
      <div className={Styles.MarketOutcomeChartsHeader__Candlestick}>
        <MarketOutcomeChartsHeaderCandlestick
          outcomeName={outcomeName}
          volume={hoveredPeriod.volume}
          open={hoveredPeriod.open}
          high={hoveredPeriod.high}
          low={hoveredPeriod.low}
          close={hoveredPeriod.close}
          priceTimeSeries={priceTimeSeries}
          fixedPrecision={fixedPrecision}
          updateSelectedPeriod={updateSelectedPeriod}
        />
      </div>
    )}
    <div className={Styles.MarketOutcomeChartsHeader__Depth}>
      <MarketOutcomeChartHeaderDepth
        fixedPrecision={fixedPrecision}
        hoveredDepth={hoveredDepth}
      />
    </div>
    <div className={Styles.MarketOutcomeChartsHeader__Orders}>
      <MarketOutcomeChartHeaderOrders
        fixedPrecision={fixedPrecision}
        updatePrecision={updatePrecision}
      />
    </div>
  </section>
);

export default MarketOutcomeChartsHeader;

MarketOutcomeChartsHeader.propTypes = {
  outcomeName: PropTypes.string.isRequired,
  hoveredPeriod: PropTypes.object.isRequired,
  hoveredDepth: PropTypes.array.isRequired,
  fixedPrecision: PropTypes.number.isRequired,
  updatePrecision: PropTypes.func.isRequired,
  updateSelectedPeriod: PropTypes.func.isRequired,
  priceTimeSeries: PropTypes.array,
  excludeCandlestick: PropTypes.bool
};

MarketOutcomeChartsHeader.defaultProps = {
  excludeCandlestick: false,
  priceTimeSeries: []
};
