import type { Getters } from '@augurproject/sdk';
import { SCALAR_UP_ID } from 'modules/common/constants';
import { DashlineLong } from 'modules/common/labels';
import Styles
  from 'modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display.styles.less';
import MarketOutcomeTradingIndicator
  from 'modules/market/containers/market-outcome-trading-indicator';
import { FormattedNumber } from 'modules/types';
import React from 'react';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { formatDaiPrice } from 'utils/format-number';

import getValue from 'utils/get-value';

export function calculatePosition(
  min: BigNumber,
  max: BigNumber,
  lastPrice: FormattedNumber | null
) {
  const range = max.minus(min);
  const pricePercentage = createBigNumber(lastPrice?.value ? lastPrice.value : min)
    .minus(min)
    .dividedBy(range)
    .times(createBigNumber(100))
    .toNumber();

  return lastPrice === null ? 50 : pricePercentage;
};

interface MarketScalarOutcomeDisplayProps {
  outcomes: Getters.Markets.MarketInfoOutcome[],
  max: BigNumber,
  min: BigNumber,
  scalarDenomination?: string,
}

const MarketScalarOutcomeDisplay: React.FC<MarketScalarOutcomeDisplayProps> = ({
  outcomes,
  max,
  min,
  scalarDenomination,
}) => {
  const lastPrice = getValue(outcomes[SCALAR_UP_ID], 'price');
  const lastPriceFormatted = formatDaiPrice(lastPrice);

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

MarketScalarOutcomeDisplay.defaultProps = {
  scalarDenomination: 'N/A',
};

export default MarketScalarOutcomeDisplay;
