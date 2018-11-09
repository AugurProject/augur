import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  BUY_UP,
  BUY_DOWN,
  SELL_UP,
  SELL_DOWN,
  NONE
} from "modules/trades/constants/types";
import Styles from "modules/market/components/common/outcome-trading-indicator/outcome-trading-indicator.style";

export default function OutcomeTradingIndicator({
  tradingIndicator,
  style,
  location,
  isMobile
}) {
  const indicatorArray = {
    [BUY_UP]: Styles.TradingIndicator_arrow_buy_up,
    [BUY_DOWN]: Styles.TradingIndicator_arrow_buy_down,
    [SELL_UP]: Styles.TradingIndicator_arrow_sell_up,
    [SELL_DOWN]: Styles.TradingIndicator_arrow_sell_down,
    [NONE]: ""
  };

  const indicatorStyle = indicatorArray[tradingIndicator];

  const direction = indicator => {
    const i = [BUY_UP, SELL_UP, BUY_DOWN, SELL_DOWN].indexOf(indicator);
    if (i >= 0) {
      return i <= 1 ? "up" : "down";
    }
    return NONE;
  };

  const spacing = (loc, direction) => {
    if (direction !== NONE) {
      switch (`${loc}|${direction}`) {
        case "yes-no-scalar|up":
          return { bottom: "0.975rem" };
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
        case "positions|up":
          return { bottom: "0.9rem" };
        case "positions|down":
          return { top: "0.945rem" };
        case "modileTradingForm|down":
          return { top: "1rem" };
        case "modileTradingForm|up":
          return { bottom: "1rem" };
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
