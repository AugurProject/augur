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
  isMobile
}) {
  const indicatorArray = {};
  indicatorArray[BUY_UP] = Styles.TradingIndicator_arrow_buy_up;
  indicatorArray[BUY_DOWN] = Styles.TradingIndicator_arrow_buy_down;
  indicatorArray[SELL_UP] = Styles.TradingIndicator_arrow_sell_up;
  indicatorArray[SELL_DOWN] = Styles.TradingIndicator_arrow_sell_down;
  indicatorArray[NONE] = "";

  const indicatorStyle = indicatorArray[tradingIndicator];

  const topSpace = tradingIndicator => {
    if (tradingIndicator === BUY_UP || tradingIndicator === SELL_UP) {
      return -1.125;
    } else if (
      tradingIndicator === BUY_DOWN ||
      tradingIndicator === SELL_DOWN
    ) {
      return 1.125;
    }
    return 0;
  };

  const arrowStyles = tradingIndicator => ({
    top: topSpace(tradingIndicator) + "rem",
    left: "-0.25rem",
    position: "relative",
    ...style
  });

  return (
    <span
      className={classNames(indicatorStyle, { [`${Styles.small}`]: isMobile })}
      style={arrowStyles(tradingIndicator)}
    />
  );
}

OutcomeTradingIndicator.propTypes = {
  tradingIndicator: PropTypes.string.isRequired,
  style: PropTypes.object,
  isMobile: PropTypes.bool
};
