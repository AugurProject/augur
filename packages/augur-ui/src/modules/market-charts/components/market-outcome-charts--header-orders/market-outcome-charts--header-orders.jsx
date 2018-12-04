import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import Styles from "modules/market-charts/components/market-outcome-charts--header-orders/market-outcome-charts--header-orders.styles";
import StylesHeader from "modules/market-charts/components/market-outcome-charts--header/market-outcome-charts--header.styles";

const MarketOutcomeChartsHeaderOrders = ({
  updatePrecision,
  isMobile,
  headerHeight
}) => (
  <section
    className={Styles.MarketOutcomeChartsHeader__orders}
    style={{ minHeight: isMobile && headerHeight }}
  >
    {isMobile || (
      <div className={StylesHeader.MarketOutcomeChartsHeader__Header}>
        <span>Order Book</span>
        {updatePrecision && (
          <div
            className={
              StylesHeader["MarketOutcomeChartsHeader__precision-selector"]
            }
          >
            <button onClick={() => updatePrecision(false)}>-</button>
            <button onClick={() => updatePrecision(true)}>+</button>
          </div>
        )}
      </div>
    )}
    <div
      className={classNames(
        StylesHeader.MarketOutcomeChartsHeader__stats,
        Styles["MarketOutcomeChartsHeader__stats--orders"]
      )}
    >
      <div className={StylesHeader["MarketOutcomeChartsHeader__stat--right"]}>
        <span className={StylesHeader["MarketOutcomeChartsHeader__stat-title"]}>
          ask qty
        </span>
      </div>
      <div className={StylesHeader["MarketOutcomeChartsHeader__stat--right"]}>
        <span className={StylesHeader["MarketOutcomeChartsHeader__stat-title"]}>
          price
        </span>
      </div>
      <div className={StylesHeader["MarketOutcomeChartsHeader__stat--right"]}>
        <span className={StylesHeader["MarketOutcomeChartsHeader__stat-title"]}>
          my size
        </span>
      </div>
    </div>
  </section>
);

export default MarketOutcomeChartsHeaderOrders;

MarketOutcomeChartsHeaderOrders.propTypes = {
  updatePrecision: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  headerHeight: PropTypes.number.isRequired
};
