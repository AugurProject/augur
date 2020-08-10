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
  repToDaiRate: FormattedNumber;
  usdcToDaiRate: FormattedNumber;
  usdtToDaiRate: FormattedNumber;
}

export const Rate = ({
  baseToken,
  swapForToken,
  repRate,
  ethRate,
  ethToDaiRate,
  repToDaiRate,
  usdcToDaiRate,
  usdtToDaiRate,
}: RateProps) => {
  let displayRate = null;

  const usdtDaiRate = usdtToDaiRate.value / 10**12;
  const usdcDaiRate = usdcToDaiRate.value / 10**12;
  // Rates for converting TO DAI
  if (swapForToken === DAI) {
    if (baseToken === REP) {
      displayRate = `1 REPv2 = $${formatDai(repToDaiRate.value).formattedValue}`;
    }
    else if (baseToken === USDT) {

      displayRate = `1 USDT = ${formatEther(usdtDaiRate).formattedValue} DAI`;
    }
    else if (baseToken === USDC) {
      displayRate = `1 USDC = ${formatEther(usdcDaiRate).formattedValue} DAI`;
    }
    else if (baseToken === ETH) {
      displayRate = `1 ETH = $${formatDai(ethToDaiRate.value).formattedValue}`;
    }
  }

  // Rates for converting TO REPv2
  else if (swapForToken === REP) {
    const repInDai = repRate.multipliedBy(ethToDaiRate.value);

    if (baseToken === ETH) {
      displayRate = `1 REPv2 = ${formatEther(repRate).formattedValue} ETH`;
    }
    else if (baseToken === DAI) {
      displayRate = `1 REPv2 = ${formatDai(repInDai).formattedValue} DAI`;
    }
  }

  // Rates for converting TO ETH
  else if (swapForToken === ETH) {
    if (baseToken === REP) {
      displayRate = `1 REPv2 = ${formatEther(repRate).formattedValue} ETH`;
    }
    else if (baseToken === DAI) {
      displayRate = `1 DAI = ${formatEther(ethRate).formattedValue} ETH`;
    }
    else if (baseToken === USDC) {
      displayRate = `1 USDC = ${formatEther((createBigNumber(usdcDaiRate)).multipliedBy(ethRate)).formattedValue} ETH`;
    }
    else if (baseToken === USDT) {
      displayRate = `1 USDT = ${formatEther((createBigNumber(usdtDaiRate)).multipliedBy(ethRate)).formattedValue} ETH`;
    }
  }

  return (
    <div className={Styles.Rate}>
      <div>Exchange Rate</div>

      <div>{displayRate}</div>
    </div>
  );
};