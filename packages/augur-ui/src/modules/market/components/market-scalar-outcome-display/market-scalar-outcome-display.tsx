import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import getValue from "utils/get-value";
import CustomPropTypes from "utils/custom-prop-types";
import { createBigNumber } from "utils/create-big-number";
import { DashlineLong } from "modules/common/labels";
import MarketOutcomeTradingIndicator from "modules/market/containers/market-outcome-trading-indicator";
import Styles from "modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display.styles";

const MarketScalarOutcomeDisplay = ({
  outcomes,
  max,
  min,
  scalarDenomination = "N/A"
}) => {
  const calculatePosition = () => {
    const lastPrice =
      getValue(outcomes[0], "lastPricePercent.fullPrecision") || 0;

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

  const lastPriceDenomination = getValue(
    outcomes[0],
    "lastPricePercent.denomination"
  );

  return (
    <div className={Styles.ScalarOutcomes}>
      <div>
        <div />
        <div>
          <DashlineLong />
          <div style={currentValuePosition}>
            <span>
              {getValue(outcomes[0], "lastPricePercent.formatted")}
            </span>
            <span>
              {lastPriceDenomination}
            </span>
            <MarketOutcomeTradingIndicator
              outcome={outcomes[0]}
              location="scalarScale"
            />
          </div>
        </div>
        <div />
      </div>
      <div
        className={classNames(
          Styles.MarketScalarOutcomes__minMax
        )}
      >
        <div>
          Min:{" "}
          <span>
            {`${min}`}
          </span>
        </div>
        <div>
          Max:{" "}
          <span>
            {`${max}`}
          </span>
        </div>
      </div>
      <div>
        <div>{scalarDenomination}</div>
        <div>{scalarDenomination}</div>
      </div>
    </div>
  );
};

MarketScalarOutcomeDisplay.propTypes = {
  outcomes: PropTypes.array.isRequired,
  max: CustomPropTypes.bigNumber.isRequired,
  min: CustomPropTypes.bigNumber.isRequired,
  scalarDenomination: PropTypes.string
};

MarketScalarOutcomeDisplay.defaultProps = {
  scalarDenomination: "N/A"
};

export default MarketScalarOutcomeDisplay;
