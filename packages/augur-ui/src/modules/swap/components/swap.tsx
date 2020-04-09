import React, { useState } from 'react';

import { ETH, DAI, REP, TRANSACTIONS, SWAPEXACTTOKENSFORTOKENS } from 'modules/common/constants';
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
} from 'modules/contracts/actions/contractCalls';

import Styles from 'modules/swap/components/index.styles.less';
import { ProcessingButton } from 'modules/common/buttons';

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
  let formattedInputAmount: FormattedNumber;
  let outputAmount: FormattedNumber = formatEther(0);
  let poolRate: FormattedNumber = formatEther(0);

  const [inputAmount, setInputAmount] = useState(createBigNumber(0));
  const setAmountToSwap = (
    amount: BigNumber,
    formattedInputAmount: BigNumber
  ) => {
    if (amount.lte(0) || isNaN(amount.toNumber())) {
      setInputAmount(createBigNumber(0));
    } else if (amount.gt(formattedInputAmount)) {
      setInputAmount(formattedInputAmount);
    } else {
      setInputAmount(amount);
    }
  };

  if (fromToken === DAI) {
    formattedInputAmount = formatEther(Number(balances.dai) || 0);
  } else if (fromToken === REP) {
    formattedInputAmount = formatEther(Number(balances.rep) || 0);
  }

  if (toToken === REP) {
    if (fromToken === DAI) {
      outputAmount = formatEther(inputAmount.dividedBy(REP_RATE));
    }
    if (fromToken === ETH) {
      outputAmount = formatEther(
        inputAmount.multipliedBy(ETH_RATE).dividedBy(REP_RATE)
      );
    }
  } else if (toToken === DAI) {
    if (fromToken === REP) {
      outputAmount = formatEther(REP_RATE.multipliedBy(inputAmount));
    }
    if (fromToken === ETH) {
      outputAmount = formatEther(ETH_RATE.multipliedBy(inputAmount));
    }
  }

  if (fromToken === REP) {
    poolRate = formatEther(
      createBigNumber(1)
        .multipliedBy(ETH_RATE)
        .dividedBy(REP_RATE)
    );
  } else {
    poolRate = formatEther(createBigNumber(1).multipliedBy(ETH_RATE));
  }

  const clearForm = () => {
    setInputAmount(createBigNumber(0));
    outputAmount = formatEther(0);
  }

  const makeTrade = async () => {
    const input = inputAmount;
    const output = createBigNumber(outputAmount.value);

    if (fromToken === DAI) {
      await uniswapDaiForRep(input, output);
      clearForm();
    } else if (fromToken === REP) {
      await uniswapRepForDai(input, output);
      clearForm();
    }
  }

  return (
    <div className={Styles.Swap}>
      <>
        <SwapRow
          amount={formatEther(inputAmount)}
          token={fromToken}
          label={'Input'}
          balance={formattedInputAmount}
          logo={
            fromToken === DAI
              ? DaiLogoIcon
              : fromToken === REP
              ? REPIcon
              : ETHIcon
          }
          setAmount={setAmountToSwap}
          setMaxAmount={setInputAmount}
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
        baseToken={fromToken}
        swapForToken={toToken}
        repRate={REP_RATE}
        ethRate={ETH_RATE}
      />

      <div>
        <ProcessingButton
          text={'Trade'}
          action={() => makeTrade()}
          queueName={TRANSACTIONS}
          queueId={SWAPEXACTTOKENSFORTOKENS}
          disabled={outputAmount.value <= 0}
        />
      </div>
    </div>
  );
};
