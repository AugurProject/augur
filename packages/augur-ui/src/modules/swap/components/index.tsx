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

import Styles from 'modules/swap/components/index.styles.less';

interface SwapProps {
  balances: AccountBalances;
  toToken: string;
  fromToken: string;
}

export const Swap = ({ balances, fromToken, toToken }: SwapProps) => {
  // TODO placeholder rates until price feed is hooked up
  const ETH_RATE = 160.63;
  const REP_RATE = 15.87;

  const setFromToken = () => {
    const nextToken = selectedToken === ETH ? DAI : ETH;
    setSelectedFromTokenAmount('');
    setSelectedToken(nextToken);
  };

  const setTokenAmount = (amount, displayBalance) => {
    if (amount < 0) {
      setSelectedFromTokenAmount('');
    } else if (amount > displayBalance) {
      setSelectedFromTokenAmount(displayBalance);
    } else {
      setSelectedFromTokenAmount(amount);
    }
  };

  let displayBalance;
  const [selectedToken, setSelectedToken] = useState(fromToken);
  const [selectedFromTokenAmount, setSelectedFromTokenAmount] = useState('');

  if (selectedToken === DAI) {
    displayBalance = formatDai(Number(balances.dai) || 0);
  } else {
    displayBalance = formatEther(
      Number(balances[selectedToken === REP ? 'rep' : 'eth']) || 0
    );
  }

  let result = 0;
  if (Number(selectedFromTokenAmount) > 0 && selectedToken === DAI) {
    result = Number(selectedFromTokenAmount) / REP_RATE;
  }

  if (selectedToken === ETH) {
    result = (Number(selectedFromTokenAmount) * ETH_RATE) / REP_RATE;
  }

  return (
    <div className={Styles.Swap}>
      <SwapRow
        amount={selectedFromTokenAmount}
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
  amount: number | string;
  setTokenAmount?: Function;
  setFromToken?: Function;
  setAmount?: Function;
  logo?: React.ReactFragment;
}

export const SwapRow = ({
  token,
  label,
  balance,
  amount = 0,
  setAmount,
  setTokenAmount,
  setFromToken,
  logo = null,
}: SwapBlockProps) => (
  <div className={Styles.SwapRow}>
    <div>
      <div>{label}</div>
      <div onClick={setAmount ? () => setAmount(balance.formattedValue) : null}>
        Balance: {balance.formattedValue}
      </div>
    </div>

    <div>
      {!setTokenAmount && <div>{Number(amount).toFixed(4)}</div>}
      {setTokenAmount && (
        <input
          placeholder='0'
          type='number'
          value={amount}
          onChange={e => setTokenAmount(e.target.value, balance.formattedValue)}
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
