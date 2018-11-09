import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { BUY, SELL } from "modules/trades/constants/types";
import Styles from "modules/market/components/market-outcome-trading-type-indicator/market-outcome-trading-type-indicator.styles";

export default function OutcomeTradingIndicator({
  tradingIndicator,
  style,
  ...p
}) {
  return (
    <span
      style={style}
      className={classNames(Styles.TradingTypeIndicator, {
        [Styles.TradingTypeIndicator__buy]: tradingIndicator === BUY,
        [Styles.TradingTypeIndicator__sell]: tradingIndicator === SELL
      })}
    >
      {p.children}
    </span>
  );
}

OutcomeTradingIndicator.propTypes = {
  tradingIndicator: PropTypes.string.isRequired,
  style: PropTypes.object
};

OutcomeTradingIndicator.defaultProps = {
  style: {}
};
