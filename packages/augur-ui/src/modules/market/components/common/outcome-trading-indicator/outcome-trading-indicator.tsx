import React from "react";
import { UP, DOWN, NONE } from "modules/common/constants";
import Styles from "modules/market/components/common/outcome-trading-indicator/outcome-trading-indicator.styles.less";

interface OutcomeTradingIndicatorProps {
  tradingIndicator: string;
  style?: object;
  location: string;
}

const OutcomeTradingIndicator: React.FC<OutcomeTradingIndicatorProps> = ({
  tradingIndicator,
  style,
  location
}) => {
  const indicatorArray = {
    [UP]: Styles.Up,
    [DOWN]: Styles.Down,
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
            borderWidth: "0 3px 4px",
            opacity: "1"
          };
        case "tradingPage|down":
          return {
            position: "absolute",
            marginLeft: "0.75rem",
            borderWidth: "4px 3px 0",
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
      className={indicatorStyle}
      style={arrowStyles(location, direction(tradingIndicator))}
    />
  );
}

OutcomeTradingIndicator.defaultProps = {
  style: {}
};

export default OutcomeTradingIndicator