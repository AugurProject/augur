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

import Styles from 'modules/swap/components/index.styles.less';

interface SwapProps {
  balances: AccountBalances;
  toToken: string;
  fromToken: string;
  ETH_RATE: number;
  REP_RATE: number;
}

export const Swap = ({
  balances,
  fromToken,
  toToken,
  ETH_RATE,
  REP_RATE,
}: SwapProps) => {
  const setFromToken = () => {
    const nextToken = selectedToken === ETH ? DAI : ETH;
    setSelectedFromTokenAmount(createBigNumber(0));
    setSelectedToken(nextToken);
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

  let displayBalance: FormattedNumber;
  const [selectedToken, setSelectedToken] = useState(fromToken);
  const [selectedFromTokenAmount, setSelectedFromTokenAmount] = useState(createBigNumber(0));

  if (selectedToken === DAI) {
    displayBalance = formatDai(Number(balances.dai) || 0);
  } else {
    displayBalance = formatEther(
      Number(balances[selectedToken === REP ? 'rep' : 'eth']) || 0
    );
  }

  let result = formatEther(0);
  if (selectedFromTokenAmount.gt(0) && selectedToken === DAI) {
    result = formatEther(selectedFromTokenAmount.dividedBy(REP_RATE));
  }

  if (selectedToken === ETH) {
    result = formatEther(selectedFromTokenAmount.multipliedBy(ETH_RATE).dividedBy(REP_RATE));
  }

  return (
    <div className={Styles.Swap}>
      <SwapRow
        amount={formatEther(selectedFromTokenAmount)}
        token={selectedToken}
        label={'Input'}
        balance={displayBalance}
        logo={selectedToken === DAI ? DaiLogoIcon : ETHIcon}
        setTokenAmount={setTokenAmount}
        setAmount={setSelectedFromTokenAmount}
        setFromToken={setFromToken}
      />

      <div>{SwapArrow}</div>

      <SwapRow
        amount={result}
        token={toToken}
        label={'Output (estimated)'}
        balance={formatEther(balances.rep)}
        logo={REPIcon}
      />

      <SwapRate
        baseToken={selectedToken}
        swapForToken={REP}
        repRate={REP_RATE}
        ethRate={ETH_RATE}
      />

      <button>Swap</button>
    </div>
  );
};

interface SwapBlockProps {
  token: string;
  label: string;
  balance: FormattedNumber;
  amount: FormattedNumber;
  setTokenAmount?: Function;
  setFromToken?: Function;
  setAmount?: Function;
  logo?: React.ReactFragment;
}

export const SwapRow = ({
  token,
  label,
  balance,
  amount,
  setAmount,
  setTokenAmount,
  setFromToken,
  logo = null,
}: SwapBlockProps) => (
  <div className={Styles.SwapRow}>
    <div>
      <div>{label}</div>
      <div onClick={setAmount ? () => setAmount(createBigNumber(balance.value)) : null}>
        Balance: {balance.formattedValue}
      </div>
    </div>

    <div>
      {!setTokenAmount && <div>{amount.formattedValue}</div>}
      {setTokenAmount && (
        <input
          placeholder='0'
          type='number'
          value={amount.formattedValue}
          onChange={e => setTokenAmount(createBigNumber(e.target.value), createBigNumber(balance.value))}
        />
      )}
      <div>
        <div onClick={setFromToken ? () => setFromToken() : null}>
          {logo} {token}
        </div>
      </div>
    </div>
  </div>
);

interface SwapRateProps {
  baseToken: string;
  swapForToken: string;
  repRate: number;
  ethRate: number;
}

export const SwapRate = ({
  baseToken,
  swapForToken,
  repRate,
  ethRate,
}: SwapRateProps) => (
  <div className={Styles.SwapRate}>
    <div>Exchange Rate</div>
    <div>{`1 ${swapForToken} = ${
      baseToken === DAI
        ? repRate + ' DAI'
        : (repRate / ethRate).toFixed(4) + ' ETH'
    }`}</div>
  </div>
);
