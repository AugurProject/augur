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
}

export const Swap = ({
  balances,
  fromToken,
  toToken,
  ETH_RATE,
  REP_RATE,
  config,
  address,
}: SwapProps) => {

  const hasEth = createBigNumber(balances.eth).gt(ZERO);
  let formattedInputAmount: FormattedNumber;
  let outputAmount: FormattedNumber = formatEther(0);

  const [inputAmount, setInputAmount] = useState(createBigNumber(0.0));
  const [fromTokenType, setFromTokenType] = useState(fromToken);
  const [errorMessage, setErrorMessage] = useState(null);

  if (![DAI, REP, ETH].includes(fromTokenType)) {
    throw Error('unsupported uniswap token');
  }


  const setAmountToSwap = (
    amount: BigNumber,
    formattedInputAmount: BigNumber
  ) => {
    setErrorMessage('');
    if (amount.lt(0) || isNaN(amount.toNumber())) {
      setInputAmount(createBigNumber(0));
    } else if (amount.gt(formattedInputAmount)) {
      setInputAmount(formattedInputAmount);
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
    if (fromToken === REP) {
      if (fromTokenType === REP) {
        setFromTokenType(hasEth ? ETH : REP);
      } else {
        setFromTokenType(REP);
      }
    } else if (fromToken === DAI) {
      if (fromTokenType === DAI) {
        setFromTokenType(hasEth ? ETH : DAI);
      } else {
        setFromTokenType(DAI);
      }
    }
    clearForm()
  }

  if (fromTokenType === DAI) {
    formattedInputAmount = formatEther(Number(balances.dai) || 0);
  } else if (fromTokenType === REP) {
    formattedInputAmount = formatEther(Number(balances.rep) || 0);
  } else if (fromTokenType === ETH) {
    formattedInputAmount = formatEther(Number(balances.eth) || 0);
  }

  if (inputAmount.lt(0)) {
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
          showChevron={hasEth}
          balance={formattedInputAmount}
          logo={
            fromTokenType === DAI
              ? DaiLogoIcon
              : fromTokenType === REP
              ? REPIcon
              : ETHIcon
          }
          setAmount={setAmountToSwap}
          setMaxAmount={setInputAmount}
          setToken={() => handleSetToken()}
        />

        <div>{SwapArrow}</div>

        <SwapRow
          amount={outputAmount}
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
        baseToken={fromTokenType}
        swapForToken={toToken}
        repRate={REP_RATE}
        ethRate={ETH_RATE}
      />

      <div>
        <ProcessingButton
          text={'Trade'}
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
