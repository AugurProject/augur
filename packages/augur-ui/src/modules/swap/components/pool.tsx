import React, { useState } from 'react';

import { DAI, REP, TRANSACTIONS, ADDLIQUIDITY } from 'modules/common/constants';
import { AccountBalances } from 'modules/types';
import {
  REP as REPIcon,
  DaiLogoIcon,
} from 'modules/common/icons';
import { formatEther } from 'utils/format-number';
import { BigNumber, createBigNumber } from 'utils/create-big-number';
import { addLiquidityRepDai } from 'modules/contracts/actions/contractCalls';
import { SwapRow } from 'modules/swap/components/swap-row';
import Styles from 'modules/swap/components/index.styles.less';
import { ProcessingButton } from 'modules/common/buttons';

interface PoolProps {
  balances: AccountBalances;
}

export const Pool = ({ balances }: PoolProps) => {
  const [selectedBottomAmount, setSelectedBottomAmount] = useState(
    createBigNumber(0)
  );

  const [selectedTopAmount, setSelectedTopAmount] = useState(
    createBigNumber(0)
  );

  const clearForm = () => {
    setSelectedBottomAmount(createBigNumber(0));
    setSelectedTopAmount(createBigNumber(0));
  }


  const setTopAmount = (amount: BigNumber, displayBalance: BigNumber) => {
    if (amount.lte(0)) {
      setSelectedTopAmount(createBigNumber(0));
    } else if (amount.gt(displayBalance)) {
      setSelectedTopAmount(displayBalance);
    } else {
      setSelectedTopAmount(amount);
    }
  };

  const setBottomAmount = (amount: BigNumber, displayBalance: BigNumber) => {
    if (amount.lte(0)) {
      setSelectedBottomAmount(createBigNumber(0));
    } else if (amount.gt(displayBalance)) {
      setSelectedBottomAmount(displayBalance);
    } else {
      setSelectedBottomAmount(amount);
    }
  };

  return (
    <div className={Styles.Pool}>
      <SwapRow
        amount={formatEther(selectedTopAmount)}
        setAmount={setTopAmount}
        setMaxAmount={setSelectedTopAmount}
        label={'Deposit'}
        balance={formatEther(balances.dai)}
        logo={DaiLogoIcon}
        token={DAI}
      />

      <div>+</div>

      <SwapRow
        amount={formatEther(selectedBottomAmount)}
        setAmount={setBottomAmount}
        setMaxAmount={setSelectedBottomAmount}
        label={'Deposit'}
        balance={formatEther(balances.rep)}
        logo={REPIcon}
        token={REP}
      />

      <div>
        <ProcessingButton
          text={'Add Liquidity'}
          action={() => {
            clearForm();
            addLiquidityRepDai(selectedTopAmount, selectedBottomAmount);
          }}
          queueName={TRANSACTIONS}
          queueId={ADDLIQUIDITY}
          disabled={selectedTopAmount.isLessThanOrEqualTo(0) || selectedBottomAmount.isLessThanOrEqualTo(0)}
        />
      </div>
    </div>
  );
};
