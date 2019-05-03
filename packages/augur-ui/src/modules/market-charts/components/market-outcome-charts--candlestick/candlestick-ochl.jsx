import React from "react";
import PropTypes from "prop-types";
import Styles from "modules/market-charts/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick.styles";

export const CandlestickOchl = ({ hoveredPeriod, pricePrecision }) => (
  <div className={Styles.MarketOutcomeChartsHeader__stats}>
    <span>
      {hoveredPeriod.open && (
        <>
          <span>O:</span>
          <span>{hoveredPeriod.open.toFixed(pricePrecision).toString()}</span>
        </>
      )}
    </span>
    <span>
      {hoveredPeriod.close && (
        <>
          <span>C:</span>
          <span>{hoveredPeriod.close.toFixed(pricePrecision).toString()}</span>
        </>
      )}
    </span>
    <span>
      {hoveredPeriod.high && (
        <>
          <span>H:</span>
          <span>{hoveredPeriod.high.toFixed(pricePrecision).toString()}</span>
        </>
      )}
    </span>
    <span>
      {hoveredPeriod.low && (
        <>
          <span>L:</span>
          <span>{hoveredPeriod.low.toFixed(pricePrecision).toString()}</span>
        </>
      )}
    </span>
    <span>ETH</span>
  </div>
);

CandlestickOchl.propTypes = {
  hoveredPeriod: PropTypes.object,
  pricePrecision: PropTypes.number.isRequired
};

CandlestickOchl.defaultProps = {
  hoveredPeriod: {}
};
