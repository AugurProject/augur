import React from 'react';
import PropTypes from 'prop-types';

import getValue from 'utils/get-value';
import CustomPropTypes from 'utils/custom-prop-types';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import { DashlineLong } from 'modules/common/labels';
import MarketOutcomeTradingIndicator from 'modules/market/containers/market-outcome-trading-indicator';
import Styles from 'modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display.styles.less';
import { YES_NO_YES_ID } from 'modules/common/constants';
import { formatDai } from 'utils/format-number';
import { FormattedNumber } from 'modules/types';

export function calculatePosition(
  min: BigNumber,
  max: BigNumber,
  lastPrice: FormattedNumber|null
) {  
  const range = max.minus(min);
  const pricePercentage = createBigNumber(lastPrice ? lastPrice.value : 0)
    .minus(min)
    .dividedBy(range)
    .times(createBigNumber(100))
    .toNumber();

  return lastPrice === null ? 50 : pricePercentage;
};

const MarketScalarOutcomeDisplay = ({
  outcomes,
  max,
  min,
  scalarDenomination = 'N/A',
}) => {
  const lastPrice = getValue(outcomes[YES_NO_YES_ID], 'price');
  const lastPriceFormatted = formatDai(lastPrice);

  const outcomeVerticalLinePosition = (): string => {
    let pos = calculatePosition(min, max, lastPrice === null ? null : lastPriceFormatted).toString();
    if (pos > 99.0) {
      pos = 99.0;
    } else if (pos < 1.0) {
      pos = 1.0;
    }
    return pos.toString();
  };


  const currentValuePosition = {
    left: outcomeVerticalLinePosition() + '%',
  };

  return (
    <div className={Styles.ScalarOutcomes}>
      <div>
        <div>
          Min
          <span>{`${min}`}</span>
        </div>
        <div>{scalarDenomination}</div>
        <div>
          Max
          <span>{`${max}`}</span>
        </div>
      </div>
      <div>
        <DashlineLong />
        <div style={currentValuePosition}>
          <span>{lastPrice ? lastPriceFormatted.formatted : '-'}</span>
          <MarketOutcomeTradingIndicator
            outcome={outcomes[0]}
            location="scalarScale"
          />
        </div>
      </div>
    </div>
  );
};

MarketScalarOutcomeDisplay.propTypes = {
  outcomes: PropTypes.array.isRequired,
  max: CustomPropTypes.bigNumber.isRequired,
  min: CustomPropTypes.bigNumber.isRequired,
  scalarDenomination: PropTypes.string,
};

MarketScalarOutcomeDisplay.defaultProps = {
  scalarDenomination: 'N/A',
};

export default MarketScalarOutcomeDisplay;
