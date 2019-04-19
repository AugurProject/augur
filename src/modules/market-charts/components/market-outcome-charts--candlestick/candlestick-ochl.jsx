import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import StylesHeader from "modules/market-charts/components/market-outcome-charts--header/market-outcome-charts--header.styles";
import Styles from "modules/market-charts/components/market-outcome-charts--candlestick/market-outcome-charts--candlestick.styles";

export const CandlestickOchl = ({ hoveredPeriod, pricePrecision }) => (
  <div
    className={classNames(
      StylesHeader.MarketOutcomeChartsHeader__stats,
      Styles.MarketOutcomeChartsHeader__stats
    )}
  >
    <span
      className={classNames(
        StylesHeader.MarketOutcomeChartsHeader__stat,
        Styles.MarketOutcomeChartsHeader__stat
      )}
    >
      <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
        o:
      </span>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
        {hoveredPeriod.open ? (
          hoveredPeriod.open.toFixed(pricePrecision).toString()
        ) : (
          <span>-</span>
        )}
      </span>
    </span>
    <span
      className={classNames(
        StylesHeader.MarketOutcomeChartsHeader__stat,
        Styles.MarketOutcomeChartsHeader__stat
      )}
    >
      <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
        c:
      </span>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
        {hoveredPeriod.close ? (
          hoveredPeriod.close.toFixed(pricePrecision).toString()
        ) : (
          <span>-</span>
        )}
      </span>
    </span>
    <span
      className={classNames(
        StylesHeader.MarketOutcomeChartsHeader__stat,
        Styles.MarketOutcomeChartsHeader__stat
      )}
    >
      <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
        h:
      </span>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
        {hoveredPeriod.high ? (
          hoveredPeriod.high.toFixed(pricePrecision).toString()
        ) : (
          <span>-</span>
        )}
      </span>
    </span>
    <span
      className={classNames(
        StylesHeader.MarketOutcomeChartsHeader__stat,
        Styles.MarketOutcomeChartsHeader__stat
      )}
    >
      <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
        l:
      </span>
      <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
        {hoveredPeriod.low ? (
          hoveredPeriod.low.toFixed(pricePrecision).toString()
        ) : (
          <span>-</span>
        )}
      </span>
    </span>
  </div>
);

CandlestickOchl.propTypes = {
  hoveredPeriod: PropTypes.object,
  pricePrecision: PropTypes.number.isRequired
};

CandlestickOchl.defaultProps = {
  hoveredPeriod: {}
};
