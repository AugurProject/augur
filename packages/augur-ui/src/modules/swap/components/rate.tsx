import React from 'react';
import { DAI, REP, ETH, USDC, USDT } from 'modules/common/constants';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { formatEther, formatRep, formatDai } from 'utils/format-number';

import Styles from 'modules/swap/components/rate.styles.less';
import { FormattedNumber } from 'modules/types';
import { swap } from './index.styles.less';

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
  repToDaiRate,
}: RateProps) => {
  let displayRate = null;
  if (swapForToken === DAI) {
    if (baseToken === REP) {
      displayRate = `1 REPv2 = $${formatDai(repToDaiRate.value).formattedValue}`;
    }
    else if (baseToken === ETH) {
      displayRate = `1 ETH = $${formatDai(ethToDaiRate.value).formattedValue}`;
    }
  }
  else if (swapForToken === REP) {
    const rate =
      baseToken === DAI
        ? formatDai((repRate).multipliedBy(ethToDaiRate.value)).formattedValue + ' DAI'
        : formatEther(repRate).formattedValue + ' ETH';

    displayRate = `1 ${swapForToken === REP ? 'REPv2' : swapForToken} = ${rate}`;
  }
  return (
    <div className={Styles.Rate}>
      <div>Exchange Rate</div>

      <div>{displayRate}</div>
    </div>
  );
};
