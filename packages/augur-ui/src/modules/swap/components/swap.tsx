import React, { useState } from 'react';

import { ETH, DAI, REP } from 'modules/common/constants';
import { AccountBalances, FormattedNumber } from 'modules/types';
import {
  SwapArrow,
  REP as REPIcon,
  ETH as ETHIcon,
  DaiLogoIcon,
} from 'modules/common/icons';
import { formatEther, formatDai } from 'utils/format-number';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { Rate } from 'modules/swap/components/rate';
import { SwapRow } from 'modules/swap/components/swap-row';

import Styles from 'modules/swap/components/index.styles.less';

interface SwapProps {
  balances: AccountBalances;
  toToken: string;
  fromToken: string;
  ETH_RATE: BigNumber;
  REP_RATE: BigNumber;
}

export const Swap = ({
  balances,
  fromToken,
  toToken,
  ETH_RATE,
  REP_RATE,
}: SwapProps) => {
  let tokenPairs = [];
  if (toToken === REP) {
    tokenPairs = [DAI, ETH];
  } else {
    tokenPairs = [REP, ETH];
  }

  const setToken = () => {
    const nextToken =
      selectedToken === tokenPairs[0] ? tokenPairs[1] : tokenPairs[0];
    setSelectedFromTokenAmount(createBigNumber(0));
    setSelectedToken(nextToken);
  };

  const setTokenAmount = (amount: BigNumber, displayBalance: BigNumber) => {
    if (amount.lte(0) || isNaN(amount.toNumber())) {
      setSelectedFromTokenAmount(createBigNumber(0));
    } else if (amount.gt(displayBalance)) {
      setSelectedFromTokenAmount(displayBalance);
    } else {
      setSelectedFromTokenAmount(amount);
    }
  };

  let displayBalance: FormattedNumber;
  const [selectedToken, setSelectedToken] = useState(fromToken);
  const [selectedFromTokenAmount, setSelectedFromTokenAmount] = useState(
    createBigNumber(0)
  );

  if (selectedToken === DAI) {
    displayBalance = formatDai(Number(balances.dai) || 0);
  } else {
    displayBalance = formatEther(
      Number(balances[selectedToken === REP ? 'rep' : 'eth']) || 0
    );
  }

  let result = formatEther(0);
  if (toToken === REP) {
    if (selectedToken === DAI) {
      result = formatEther(selectedFromTokenAmount.dividedBy(REP_RATE));
    }
    if (selectedToken === ETH) {
      result = formatEther(
        selectedFromTokenAmount.multipliedBy(ETH_RATE).dividedBy(REP_RATE)
      );
    }
  } else {
    if (selectedToken === REP) {
      result = formatEther(REP_RATE.multipliedBy(selectedFromTokenAmount));
    }
    if (selectedToken === ETH) {
      result = formatEther(ETH_RATE.multipliedBy(selectedFromTokenAmount));
    }
  }

  let poolRate = formatEther(0);
  if (selectedToken === REP) {
    poolRate = formatEther(
      createBigNumber(1)
        .multipliedBy(ETH_RATE)
        .dividedBy(REP_RATE)
    );
  } else {
    poolRate = formatEther(createBigNumber(1).multipliedBy(ETH_RATE));
  }

  return (
    <div className={Styles.Swap}>
      <>
        <SwapRow
          amount={formatEther(selectedFromTokenAmount)}
          token={selectedToken}
          label={'Input'}
          balance={displayBalance}
          logo={
            selectedToken === DAI
              ? DaiLogoIcon
              : selectedToken === REP
              ? REPIcon
              : ETHIcon
          }
          setAmount={setTokenAmount}
          setMaxAmount={setSelectedFromTokenAmount}
          setToken={setToken}
        />

        <div>{SwapArrow}</div>

        <SwapRow
          amount={result}
          token={toToken}
          label={'Output (estimated)'}
          balance={
            toToken === REP
              ? formatEther(balances.rep)
              : formatEther(balances.dai)
          }
          logo={toToken === REP ? REPIcon : DaiLogoIcon}
        />
      </>
      <Rate
        baseToken={selectedToken}
        swapForToken={toToken}
        repRate={REP_RATE}
        ethRate={ETH_RATE}
      />

      <div>
        <button>{'Trade'}</button>
      </div>
    </div>
  );
};
