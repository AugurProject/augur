import React, { useState } from 'react';

import {
  ETH,
  DAI,
  REP,
  TRANSACTIONS,
  SWAPEXACTTOKENSFORTOKENS,
  SWAPETHFOREXACTTOKENS,
  ZERO,
} from 'modules/common/constants';
import { AccountBalances, FormattedNumber } from 'modules/types';
import {
  SwapArrow,
  REP as REPIcon,
  ETH as ETHIcon,
  DaiLogoIcon,
} from 'modules/common/icons';
import { formatEther } from 'utils/format-number';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { Rate } from 'modules/swap/components/rate';
import { SwapRow } from 'modules/swap/components/swap-row';
import {
  uniswapRepForDai,
  uniswapDaiForRep,
  uniswapEthForDai,
  uniswapEthForRep,
  checkSetApprovalAmount,
} from 'modules/contracts/actions/contractCalls';

import Styles from 'modules/swap/components/index.styles.less';
import { ProcessingButton } from 'modules/common/buttons';
import type { SDKConfiguration } from '@augurproject/artifacts';
import { augurSdk } from 'services/augursdk';

interface SwapProps {
  balances: AccountBalances;
  toToken: string;
  fromToken: string;
  ETH_RATE: BigNumber;
  REP_RATE: BigNumber;
  config: SDKConfiguration,
  address: string;
  useSigner: boolean;
}

const tokenIconImageMap = {
  eth: ETHIcon,
  rep: REPIcon,
  dai: DaiLogoIcon,
}

export const Swap = ({
  balances,
  fromToken,
  toToken,
  ETH_RATE,
  REP_RATE,
  config,
  address,
  useSigner = false,
}: SwapProps) => {

  const VALID_TOKENS = [DAI, REP, ETH];
  let hasEth;
  let hasRep;
  let hasDai;

  let toTokenBalance = balances[toToken.toLowerCase()] || 0;
  if (useSigner) {
    toTokenBalance = balances.signerBalances[toToken.toLowerCase()] || 0;

    hasEth = createBigNumber(balances.signerBalances.eth).gt(ZERO);
    hasRep = createBigNumber(balances.signerBalances.rep).gt(ZERO);
    hasDai = createBigNumber(balances.signerBalances.dai).gt(ZERO);
  } else {
    hasEth = createBigNumber(balances.eth).gt(ZERO);
    hasRep = createBigNumber(balances.rep).gt(ZERO);
    hasDai = createBigNumber(balances.dai).gt(ZERO);
  }

  let tokenSwapTypes = [];

  if (hasEth) {
    tokenSwapTypes = tokenSwapTypes.concat(ETH);
  }

  if (hasRep) {
    tokenSwapTypes = tokenSwapTypes.concat(REP);
  }

  if (hasDai) {
    tokenSwapTypes = tokenSwapTypes.concat(DAI);
  }

  // remove the token that is being swaapped for
  tokenSwapTypes = tokenSwapTypes.filter(token => token !== toToken);

  if (tokenSwapTypes.length === 0) {
    tokenSwapTypes = VALID_TOKENS.filter(token => token !== toToken);
  }

  let formattedInputAmount: FormattedNumber;
  let outputAmount: FormattedNumber = formatEther(0);


  const getBalanceForToken = (token) => {
    let balance = 0;
    if (useSigner) {
      balance = balances.signerBalances[token.toLowerCase()] || 0;
    } else {
      balance = balances[token.toLowerCase()] || 0;
    }
    return balance;
  }

  const setAmountToSwap = (
    amount: BigNumber,
    formattedInputAmount: BigNumber
  ) => {
    setErrorMessage('');
    if (amount.lt(0) || isNaN(amount.toNumber())) {
      setErrorMessage('Check conversion amount');
    } else if (amount.gt(formattedInputAmount)) {
      setErrorMessage('Check amount is not greater than balance');
    } else {
      setInputAmount(amount);
    }
  };

  const clearForm = () => {
    setInputAmount(createBigNumber(0));
    outputAmount = formatEther(0);
  };

  const makeTrade = async () => {
    const { contracts } = augurSdk.get();

    const input = inputAmount;
    const output = createBigNumber(outputAmount.value);
    const exchangeRateBufferMultiplier = config.uniswap?.exchangeRateBufferMultiplier || 1.005;

    try {
      if (fromTokenType === DAI) {
        await checkSetApprovalAmount(address, contracts.cash);
        await uniswapDaiForRep(input, output, exchangeRateBufferMultiplier);
        clearForm();
      } else if (fromTokenType === REP) {
        await checkSetApprovalAmount(address, contracts.reputationToken);
        await uniswapRepForDai(input, output, exchangeRateBufferMultiplier);
        clearForm();
      } else if (fromTokenType === ETH) {
        await checkSetApprovalAmount(address, contracts.weth);
        if (toToken === DAI) {
          await uniswapEthForDai(input, output, exchangeRateBufferMultiplier);
        } else if (toToken === REP) {
          await uniswapEthForRep(input, output, exchangeRateBufferMultiplier);
        }
        clearForm();
      }
    }
    catch (error) {
      if (error?.data === 'Reverted') {
        setErrorMessage('Liquidity error, please try reducing the size of your trade to avoid a price slippage.');
      }
    }
  };

  const handleSetToken = () => {
    setErrorMessage('');
    const nextToken = currentTokenIndex === tokenSwapTypes.length - 1 ? 0 : currentTokenIndex + 1;
    setCurrentTokenIndex(nextToken);
    setFromTokenType(tokenSwapTypes[nextToken]);
    updateBalance(getBalanceForToken(tokenSwapTypes[nextToken]));
    clearForm()
  }

  const [inputAmount, setInputAmount] = useState(createBigNumber(0.0));
  const [fromTokenType, setFromTokenType] = useState(fromToken ? fromToken : tokenSwapTypes[0]);
  const [balance, updateBalance] = useState(getBalanceForToken(fromTokenType));
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);

  if (!VALID_TOKENS.includes(fromTokenType)) {
    throw Error('unsupported uniswap token');
  }

  formattedInputAmount = formatEther(Number(balance) || 0);

  if (!inputAmount.lt || inputAmount.lt(0)) {
    outputAmount = formatEther(0);
  } else {
    if (toToken === REP) {
      if (fromTokenType === DAI) {
        outputAmount = formatEther(inputAmount.dividedBy(REP_RATE));
      } else if (fromTokenType === ETH) {
        const ethToDai = createBigNumber(1).dividedBy(ETH_RATE);
        const inputValueInDai = ethToDai.multipliedBy(inputAmount);
        outputAmount = formatEther(inputValueInDai.dividedBy(REP_RATE));
      }
    } else if (toToken === DAI) {
      if (fromTokenType === REP) {
        outputAmount = formatEther(REP_RATE.multipliedBy(inputAmount));
      } else if (fromTokenType === ETH) {
        outputAmount = formatEther(
          createBigNumber(inputAmount).dividedBy(ETH_RATE)
        );
      }
    }
  }

  return (
    <div className={Styles.Swap}>
      <>
        <SwapRow
          amount={formatEther(inputAmount)}
          token={fromTokenType}
          label={'Input'}
          showChevron={tokenSwapTypes.length > 1}
          balance={formattedInputAmount}
          logo={tokenIconImageMap[fromTokenType.toLowerCase()] || ETHIcon}
          setAmount={setAmountToSwap}
          setMaxAmount={setInputAmount}
          setToken={() => handleSetToken()}
        />

        <div>{SwapArrow}</div>

        <SwapRow
          amount={outputAmount}
          token={toToken}
          label={'Output (estimated)'}
          balance={formatEther(toTokenBalance)}
          logo={tokenIconImageMap[toToken.toLowerCase()] || ETHIcon}
        />
      </>
      <Rate
        baseToken={fromTokenType}
        swapForToken={toToken}
        repRate={REP_RATE}
        ethRate={ETH_RATE}
      />

      <div>
        <ProcessingButton
          text={'Convert'}
          action={() => makeTrade()}
          queueName={TRANSACTIONS}
          queueId={fromTokenType === ETH ? SWAPETHFOREXACTTOKENS : SWAPEXACTTOKENSFORTOKENS}
          disabled={outputAmount.value <= 0}
        />
        {errorMessage && <div className={Styles.SwapError}>{errorMessage}</div>}
      </div>
    </div>
  );
};
