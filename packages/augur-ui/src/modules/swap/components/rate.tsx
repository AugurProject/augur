import React from 'react';
import { DAI, REP, ETH, USDC, USDT } from 'modules/common/constants';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { formatEther, formatRep, formatDai } from 'utils/format-number';

import Styles from 'modules/swap/components/rate.styles.less';
import { FormattedNumber } from 'modules/types';

interface RateProps {
  baseToken: string;
  swapForToken: string;
  repRate: BigNumber;
  ethRate: BigNumber;
  ethToDaiRate: FormattedNumber;
  repToDaiRate: FormattedNumber
}

export const Rate = ({
  baseToken,
  swapForToken,
  repRate,
  ethRate,
  ethToDaiRate,
}: RateProps) => {
  let displayRate = null;
  if (swapForToken === REP) {
    const rate =
      baseToken === DAI
        ? formatDai((repRate).multipliedBy(ethToDaiRate.value)).formattedValue + ' DAI'
        : formatEther(repRate).formattedValue + ' ETH';

    displayRate = `1 ${swapForToken} = ${rate}`;
  } else {
    const rate =
      baseToken === ETH
        ? formatEther(repRate).formattedValue + ' ETH'
        : formatDai((repRate).multipliedBy(ethToDaiRate.value)).formattedValue  +
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
