import React from 'react';
import { DAI, REP, ETH } from 'modules/common/constants';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { formatEther, formatRep, formatDai } from 'utils/format-number';
import { FormattedNumber } from 'modules/types';

import Styles from 'modules/swap/components/rate.styles.less';

interface RateProps {
  baseToken: string;
  swapForToken: string;
  repRate: BigNumber;
  ethRate: BigNumber;
}

export const Rate = ({
  baseToken,
  swapForToken,
  repRate,
  ethRate,
}: RateProps) => {
  let displayRate = null;
  if (swapForToken === REP) {
    const rate =
      baseToken === DAI
        ? formatDai(repRate).formattedValue + ' DAI'
        : formatEther(repRate.dividedBy(ethRate)).formattedValue + ' ETH';

    displayRate = `1 ${swapForToken} = ${rate}`;
  } else {
    const rate =
      baseToken === ETH
        ? formatEther(createBigNumber(1).dividedBy(ethRate)).formattedValue +
          ' ETH'
        : formatRep(createBigNumber(1).dividedBy(repRate)).formattedValue +
          ' REP';

    displayRate = `1 ${swapForToken} = ${rate}`;
  }

  return (
    <div className={Styles.Rate}>
      <div>Exchange Rate</div>

      <div>{displayRate}</div>
    </div>
  );
};

interface PoolRateProps {
  ethRate: FormattedNumber;
  ethRateLabel: string;
  poolSize?: string | number;
  poolShare?: string | number;
}

export const PoolRate = ({
  ethRate,
  ethRateLabel,
  poolSize = '-',
  poolShare = '-',
}: PoolRateProps) => (
  <div className={Styles.RatePool}>
    <div>
      <div>Exchange Rate</div>
      <div>
        1 ETH = {ethRate.formattedValue} {ethRateLabel}
      </div>
    </div>
    <div>
      <div>Current Pool Size</div>
      <div>{poolSize}</div>
    </div>
    <div>
      <div>Your Pool Share (%)</div>
      <div>{poolShare}</div>
    </div>
  </div>
);
