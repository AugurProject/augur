import React from "react";
import PropTypes from "prop-types";

import { YES_NO } from "modules/markets/constants/market-types";

import getValue from "utils/get-value";
import CustomPropTypes from "utils/custom-prop-types";
import { createBigNumber } from "utils/create-big-number";
import MarketOutcomeTradingIndicator from "modules/market/containers/market-outcome-trading-indicator";
import MarketOutcomeTradingTypeIndicator from "modules/market/containers/market-outcome-trading-type-indicator";
import Styles from "modules/market/components/market-outcomes-yes-no-scalar/market-outcomes-yes-no-scalar.styles";

const MarketOutcomes = ({
  outcomes,
  max,
  min,
  type,
  scalarDenomination = ""
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

  const currentValuePosition = {
    left: calculatePosition() + "%"
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
        ? { marginTop: 4, fontSize: 16 }
        : { marginTop: 7, fontSize: 20 };
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
          <MarketOutcomeTradingTypeIndicator outcome={outcomes[0]}>
            <span
              className={Styles["MarketOutcomes__current-value"]}
              data-testid="midpoint"
            >
              {getValue(outcomes[0], "lastPricePercent.formatted")}
            </span>
            <span className={Styles["MarketOutcomes__current-denomination"]}>
              {lastPriceDenomination}
            </span>
          </MarketOutcomeTradingTypeIndicator>
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
  scalarDenomination: ""
};

export default MarketOutcomes;
