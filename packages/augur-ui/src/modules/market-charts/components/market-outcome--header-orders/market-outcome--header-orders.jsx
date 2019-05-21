import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { collapseIcon, expandIcon } from "modules/common/components/icons";

import StylesHeader from "modules/market/components/market-outcomes-list/market-outcomes-list.styles";
import Styles from "modules/market-charts/components/market-outcome--header-orders/market-outcome--header-orders.styles";

const MarketOutcomeChartsHeaderOrders = ({
  title,
  headers,
  extended,
  toggle,
  hide
}) => (
  <section className={Styles.MarketOutcomeChartsHeader__orders}>
    <button
      className={classNames(
        StylesHeader.MarketOutcomesList__heading,
        Styles.MarketOutcomeChartsHeader__heading
      )}
      onClick={toggle}
    >
      {title}
      <span>{extended ? expandIcon : collapseIcon}</span>
    </button>
    {!hide && (
      <div
        className={classNames(
          Styles.MarketOutcomeChartsHeader__stats,
          Styles["MarketOutcomeChartsHeader__stats--orders"]
        )}
      >
        <div
          className={Styles["MarketOutcomeChartsHeader__stat--right"]}
          style={{ justifyContent: "flex-start" }}
        >
          <span className={Styles["MarketOutcomeChartsHeader__stat-title"]}>
            {headers[0]}
          </span>
        </div>
        <div
          className={Styles["MarketOutcomeChartsHeader__stat--right"]}
          style={{ justifyContent: "center" }}
        >
          <span className={Styles["MarketOutcomeChartsHeader__stat-title"]}>
            {headers[1]}
          </span>
        </div>
        <div className={Styles["MarketOutcomeChartsHeader__stat--right"]}>
          <span className={Styles["MarketOutcomeChartsHeader__stat-title"]}>
            {headers[2]}
          </span>
        </div>
      </div>
    )}
  </section>
);

export default MarketOutcomeChartsHeaderOrders;

MarketOutcomeChartsHeaderOrders.propTypes = {
  title: PropTypes.string.isRequired,
  headers: PropTypes.array.isRequired,
  extended: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  hide: PropTypes.bool.isRequired
};
