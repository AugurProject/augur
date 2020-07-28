import React from 'react';
import { DAI, REP, ETH, USDC, USDT } from 'modules/common/constants';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { formatEther, formatRep, formatDai } from 'utils/format-number';

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
      baseToken === DAI || baseToken === USDC || baseToken === USDT
        ? formatDai(repRate).formattedValue + ' DAI'
        : formatEther(repRate.multipliedBy(ethRate)).formattedValue + ' ETH';

    displayRate = `1 ${swapForToken} = ${rate}`;
  } else {
    const rate =
      baseToken === USDC || baseToken === USDT
        ? `1 ${baseToken}`
        : baseToken === ETH
        ? formatEther(ethRate).formattedValue + ' ETH'
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
