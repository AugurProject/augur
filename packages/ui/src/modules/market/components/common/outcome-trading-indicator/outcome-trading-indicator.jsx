import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { UP, DOWN, NONE } from "modules/common-elements/constants";
import Styles from "modules/market/components/common/outcome-trading-indicator/outcome-trading-indicator.style";

export default function OutcomeTradingIndicator({
  tradingIndicator,
  style,
  location,
  isMobile
}) {
  const indicatorArray = {
    [UP]: Styles.TradingIndicator_arrow_up,
    [DOWN]: Styles.TradingIndicator_arrow_down,
    [NONE]: ""
  };

  const indicatorStyle = indicatorArray[tradingIndicator];

  const direction = indicator => {
    if (indicator === UP || indicator === DOWN) {
      return indicator;
    }
    return NONE;
  };

  const spacing = (loc, direction) => {
    if (direction !== NONE) {
      switch (`${loc}|${direction}`) {
        case "yes-no-scalar|up":
          return { bottom: "0.875rem" };
        case "yes-no-scalar|down":
          return { top: "1.075rem" };
        case "categorical|up":
          return { top: "-0.9rem" };
        case "categorical|down":
          return { top: "0.85rem" };
        case "outcomes|up":
          return { position: "absolute" };
        case "outcomes|down":
          return { top: "1.5rem", position: "absolute" };
        case "tradingPage|up":
          return {
            position: "absolute",
            marginLeft: "0.75rem",
            borderWidth: "0 4px 5px",
            opacity: "1"
          };
        case "tradingPage|down":
          return {
            position: "absolute",
            marginLeft: "0.75rem",
            borderWidth: "5px 4px 0",
            opacity: "1",
            marginBottom: "-2px"
          };
        case "scalarScale|up":
          return {
            position: "absolute",
            borderBottomColor: "#FFF",
            marginLeft: "0.3rem",
            borderWidth: "5px",
            opacity: "1"
          };
        case "scalarScale|down":
          return {
            position: "absolute",
            borderTopColor: "#FFF",
            marginLeft: "0.3rem",
            borderWidth: "5px",
            opacity: "1",
            top: "4px"
          };
        default:
          return {};
      }
    }
    return {};
  };

  const arrowStyles = (loc, indicator) => ({
    ...style,
    position: "relative",
    ...spacing(loc, indicator)
  });

  if (tradingIndicator === "none") {
    return null;
  }
  return (
    <span
      className={classNames(indicatorStyle, { [`${Styles.small}`]: isMobile })}
      style={arrowStyles(location, direction(tradingIndicator))}
    />
  );
}

OutcomeTradingIndicator.propTypes = {
  tradingIndicator: PropTypes.string.isRequired,
  style: PropTypes.object,
  location: PropTypes.string.isRequired,
  isMobile: PropTypes.bool
};

OutcomeTradingIndicator.defaultProps = {
  style: {},
  isMobile: false
};
