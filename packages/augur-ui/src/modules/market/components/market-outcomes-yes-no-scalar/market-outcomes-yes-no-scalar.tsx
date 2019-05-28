import React from "react";
import PropTypes from "prop-types";

import { YES_NO } from "modules/common-elements/constants";

import getValue from "utils/get-value";
import CustomPropTypes from "utils/custom-prop-types";
import { createBigNumber } from "utils/create-big-number";
import MarketOutcomeTradingIndicator from "modules/market/containers/market-outcome-trading-indicator";
import Styles from "modules/market/components/market-outcomes-yes-no-scalar/market-outcomes-yes-no-scalar.styles";

const MarketOutcomes = ({
  outcomes,
  max,
  min,
  type,
  scalarDenomination = "N/A"
}) => {
  const calculatePosition = () => {
    const lastPrice =
      getValue(outcomes[0], "lastPricePercent.fullPrecision") || 0;

    if (type === YES_NO) {
      return lastPrice;
    }

    const range = max.minus(min);
    return `${createBigNumber(lastPrice)
      .minus(min)
      .dividedBy(range)
      .times(createBigNumber(100))}`;
  };

  const outcomeVerticalLinePosition = () => {
    let pos = calculatePosition();
    if (pos > 99.0) {
      pos = 99.0;
    } else if (pos < 1.0) {
      pos = 1.0;
    }
    return pos;
  };

  const currentValuePosition = {
    left: outcomeVerticalLinePosition() + "%"
  };

  const minValue =
    !isNaN(min) && type !== YES_NO ? `${min} ${scalarDenomination}` : "0 %";

  const maxValue =
    !isNaN(max) && type !== YES_NO ? `${max} ${scalarDenomination}` : "100 %";

  const lastPriceDenomination =
    type !== YES_NO
      ? ""
      : getValue(outcomes[0], "lastPricePercent.denomination");

  const currentMarketStyles = pos => {
    let size = getValue(outcomes[0], "lastPricePercent.formatted").toString()
      .length;
    const isMobileAttrs =
      window.outerWidth < 590
        ? { marginTop: 0, fontSize: 16, fontWeight: "bold" }
        : { marginTop: 0, fontSize: 18, fontWeight: "bold" };
    for (let i = 6; i < size; i += 6) {
      size *= 0.8;
    }
    return {
      marginLeft: pos < 15 ? size + "rem" : 0,
      marginRight: pos > 85 ? size + "rem" : 0,
      ...isMobileAttrs
    };
  };

  return (
    <div className={Styles.MarketOutcomes}>
      <div className={Styles.MarketOutcomes__range} />
      <span className={Styles.MarketOutcomes__min}>{minValue}</span>
      <span className={Styles.MarketOutcomes__max}>{maxValue}</span>
      <span
        className={Styles.MarketOutcomes__current}
        style={currentValuePosition}
      >
        <div style={currentMarketStyles(calculatePosition())}>
          <span
            className={Styles["MarketOutcomes__current-value"]}
            data-testid="midpoint"
          >
            {getValue(outcomes[0], "lastPricePercent.formatted")}
          </span>
          <span className={Styles["MarketOutcomes__current-denomination"]}>
            {lastPriceDenomination}
          </span>
          <MarketOutcomeTradingIndicator
            outcome={outcomes[0]}
            location="yes-no-scalar"
          />
        </div>
      </span>
    </div>
  );
};

MarketOutcomes.propTypes = {
  outcomes: PropTypes.array.isRequired,
  max: CustomPropTypes.bigNumber.isRequired,
  min: CustomPropTypes.bigNumber.isRequired,
  type: PropTypes.string.isRequired,
  scalarDenomination: PropTypes.string
};

MarketOutcomes.defaultProps = {
  scalarDenomination: "N/A"
};

export default MarketOutcomes;
