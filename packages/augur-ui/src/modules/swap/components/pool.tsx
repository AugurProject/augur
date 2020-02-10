import React, { useState } from 'react';

import { ETH, DAI, REP } from 'modules/common/constants';
import { AccountBalances } from 'modules/types';
import {
  REP as REPIcon,
  ETH as ETHIcon,
  DaiLogoIcon,
} from 'modules/common/icons';
import { formatEther } from 'utils/format-number';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { PoolRate } from 'modules/swap/components/rate';
import { SwapRow } from 'modules/swap/components/swap-row';

import Styles from 'modules/swap/components/index.styles.less';

interface PoolProps {
  balances: AccountBalances;
  ETH_RATE: BigNumber;
  REP_RATE: BigNumber;
}

export const Pool = ({ balances, ETH_RATE, REP_RATE }: PoolProps) => {
  let poolRate = formatEther(0);
  const tokenPairs = [DAI, REP];
  const [selectedToken, setSelectedToken] = useState(tokenPairs[0]);
  const [selectedFromTokenAmount, setSelectedFromTokenAmount] = useState(
    createBigNumber(0)
  );
  const [selectedETHAmount, setSelectedETHAmount] = useState(
    createBigNumber(0)
  );

  const setToken = () => {
    const nextToken =
      selectedToken === tokenPairs[0] ? tokenPairs[1] : tokenPairs[0];
    setSelectedFromTokenAmount(createBigNumber(0));
    setSelectedToken(nextToken);
  };

  const setEthAmount = (amount: BigNumber, displayBalance: BigNumber) => {
    if (amount.lte(0)) {
      setSelectedETHAmount(createBigNumber(0));
    } else if (amount.gt(displayBalance)) {
      setSelectedETHAmount(displayBalance);
    } else {
      setSelectedETHAmount(amount);
    }
  };

  const setTokenAmount = (amount: BigNumber, displayBalance: BigNumber) => {
    if (amount.lte(0)) {
      setSelectedFromTokenAmount(createBigNumber(0));
    } else if (amount.gt(displayBalance)) {
      setSelectedFromTokenAmount(displayBalance);
    } else {
      setSelectedFromTokenAmount(amount);
    }
  };

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
    <div className={Styles.Pool}>
      <SwapRow
        amount={formatEther(selectedETHAmount)}
        setAmount={setEthAmount}
        setMaxAmount={setSelectedETHAmount}
        token={ETH}
        label={'Deposit'}
        balance={formatEther(balances.eth)}
        logo={ETHIcon}
      />

      <div>+</div>

      <SwapRow
        amount={formatEther(selectedFromTokenAmount)}
        setAmount={setTokenAmount}
        setMaxAmount={setSelectedFromTokenAmount}
        label={'Input'}
        balance={
          selectedToken === DAI
            ? formatEther(balances.dai)
            : formatEther(balances.rep)
        }
        logo={selectedToken === DAI ? DaiLogoIcon : REPIcon}
        setToken={setToken}
        token={selectedToken}
      />

      <PoolRate ethRate={poolRate} ethRateLabel={selectedToken} />

      <div>
        <button>{'Add Liquidity'}</button>
      </div>
    </div>
  );
};
