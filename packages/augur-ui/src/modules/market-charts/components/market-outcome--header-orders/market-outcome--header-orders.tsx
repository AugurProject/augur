import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import StylesHeader from "modules/market/components/market-outcomes-list/market-outcomes-list.styles.less";
import Styles from "modules/market-charts/components/market-outcome--header-orders/market-outcome--header-orders.styles.less";

const collapseIcon = (
  <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
    <rect
      x="1"
      y="1"
      width="18"
      height="28"
      rx="1"
      stroke="#484552"
      strokeLinecap="round"
    />
    <path
      d="M13 9L10 6L7 9"
      stroke="#484552"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 6.5L10 13.5" stroke="#484552" strokeLinecap="round" />
    <path
      d="M13 21L10 24L7 21"
      stroke="#484552"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M10 23.5L10 16.5" stroke="#484552" strokeLinecap="round" />
  </svg>
);

const expandIcon = (
  <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
    <g opacity="0.87">
      <rect
        x="1"
        y="12"
        width="18"
        height="4"
        rx="1"
        stroke="#484552"
        strokeLinecap="round"
      />
      <path
        d="M13 6L10 9L7 6"
        stroke="#484552"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="0.5"
        y1="-0.5"
        x2="7.5"
        y2="-0.5"
        transform="matrix(-4.37114e-08 -1 -1 4.37114e-08 9.5 8)"
        stroke="#484552"
        strokeLinecap="round"
      />
      <path
        d="M13 22L10 19L7 22"
        stroke="#484552"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="10"
        y1="20.5"
        x2="10"
        y2="27.5"
        stroke="#484552"
        strokeLinecap="round"
      />
    </g>
  </svg>
);

interface MarketOutcomeChartsHeaderOrdersProps {
  title: string;
  headers: Array<any>;
  extended: boolean;
  toggle: any;
  hide: boolean;
}

const MarketOutcomeChartsHeaderOrders = ({
  title,
  headers,
  extended,
  toggle,
  hide
}: MarketOutcomeChartsHeaderOrdersProps) => (
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
