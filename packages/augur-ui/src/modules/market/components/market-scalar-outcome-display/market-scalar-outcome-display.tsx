import type { MarketInfoOutcome } from '@augurproject/sdk-lite';
import React from 'react';

import getValue from 'utils/get-value';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import { DashlineLong } from 'modules/common/labels';
import OutcomeTradingIndicator from "modules/market/components/common/outcome-trading-indicator/outcome-trading-indicator";
import Styles from 'modules/market/components/market-scalar-outcome-display/market-scalar-outcome-display.styles.less';
import { SCALAR_UP_ID, WETH } from 'modules/common/constants';
import { formatDai, formatEther } from 'utils/format-number';
import { FormattedNumber } from 'modules/types';


export function calculatePosition(
  min: BigNumber,
  max: BigNumber,
  lastPrice: FormattedNumber | null,
) {
  const range = max.minus(min);
  const pricePercentage = createBigNumber(lastPrice ? lastPrice.value : 0)
    .minus(min)
    .dividedBy(range)
    .times(createBigNumber(100))
    .toNumber();

  return lastPrice === null ? 50 : pricePercentage;
};

interface MarketScalarOutcomeDisplayProps {
  outcomes: MarketInfoOutcome[];
  max: BigNumber;
  min: BigNumber;
  scalarDenomination?: string;
  paraTokenName: string;
}

const MarketScalarOutcomeDisplay: React.FC<MarketScalarOutcomeDisplayProps> = ({
  outcomes,
  max,
  min,
  scalarDenomination,
  paraTokenName,
}) => {
  const lastPrice = getValue(outcomes[SCALAR_UP_ID], 'price');
  const lastPriceFormatted = paraTokenName !== WETH ? formatDai(lastPrice) : formatEther(lastPrice);

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
          <OutcomeTradingIndicator
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
