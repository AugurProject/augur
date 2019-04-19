import React, { Component } from "react";
import PropTypes from "prop-types";
import { BigNumber } from "utils/create-big-number";

import { isNumber } from "lodash/fp";

import Styles from "modules/market-charts/components/market-outcome-charts--header/market-outcome-charts--header.styles";

import { ASKS } from "modules/common-elements/constants";

export default class MarketOutcomeDepthHeader extends Component {
  static propTypes = {
    hoveredDepth: PropTypes.array.isRequired,
    fixedPrecision: PropTypes.number.isRequired,
    pricePrecision: PropTypes.number.isRequired,
    isMobile: PropTypes.bool,
    headerHeight: PropTypes.number.isRequired,
    updateChartHeaderHeight: PropTypes.func.isRequired
  };

  static defaultProps = {
    isMobile: false
  };

  componentDidMount() {
    if (this.header)
      this.props.updateChartHeaderHeight(this.header.clientHeight);
  }

  render() {
    const {
      headerHeight,
      hoveredDepth,
      isMobile,
      fixedPrecision,
      pricePrecision
    } = this.props;

    if (isMobile) {
      return <section style={{ minHeight: headerHeight }} />;
    }
    let type = "";
    if (hoveredDepth.length > 0) {
      type = hoveredDepth[4] === ASKS ? "ask " : "bid ";
    }

    return (
      <section
        ref={header => {
          this.header = header;
        }}
        className={Styles.MarketOutcomeChartsHeader__Container}
      >
        <div className={Styles.MarketOutcomeChartsHeader__Header}>
          <span>Market Depth</span>
        </div>
        <div className={Styles.MarketOutcomeChartsHeader__stats}>
          <span className={Styles.MarketOutcomeChartsHeader__stat}>
            <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
              {type}
              qty
            </span>
            <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
              {hoveredDepth[0] ? (
                hoveredDepth[2].toFixed(fixedPrecision).toString()
              ) : (
                <span>&mdash;</span>
              )}
            </span>
          </span>
          <span className={Styles.MarketOutcomeChartsHeader__stat}>
            <span className={Styles["MarketOutcomeChartsHeader__stat-title"]}>
              price
            </span>
            <span className={Styles["MarketOutcomeChartsHeader__stat-value"]}>
              {isNumber(hoveredDepth[1]) ? (
                hoveredDepth[1].toFixed(pricePrecision).toString()
              ) : (
                <span>&mdash;</span>
              )}
            </span>
          </span>
          <span className={Styles.MarketOutcomeChartsHeader__stat}>
            <span className={Styles[`MarketOutcomeChartsHeader__stat-title`]}>
              depth
            </span>
            <span className={Styles[`MarketOutcomeChartsHeader__stat-value`]}>
              {BigNumber.isBigNumber(hoveredDepth[0]) ? (
                hoveredDepth[0].toFixed(fixedPrecision).toString()
              ) : (
                <span>&mdash;</span>
              )}
            </span>
          </span>
        </div>
      </section>
    );
  }
}
