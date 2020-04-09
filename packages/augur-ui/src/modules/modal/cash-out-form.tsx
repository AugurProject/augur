import React, { useEffect, useState } from 'react';

import { Breakdown } from 'modules/modal/common';
import {
  formatDai,
} from 'utils/format-number';
import isAddress from 'modules/auth/helpers/is-address';
import Styles from 'modules/modal/modal.styles.less';
import { createBigNumber } from 'utils/create-big-number';
import { FormattedNumber } from 'modules/types';
import { TextInput } from 'modules/common/form';
import { CloseButton, ProcessingButton, SecondaryButton } from 'modules/common/buttons';
import { TRANSFER_ETH_GAS_COST } from 'modules/auth/actions/transfer-funds';
import { ethToDai, displayGasInDai, getGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { getDaiBalance, getEthBalance } from 'modules/contracts/actions/contractCalls';
import { TRANSACTIONS } from 'modules/routes/constants/views';
import { WITHDRAWALLFUNDSASDAI } from 'modules/common/constants';

interface CashOutFormProps {
  closeAction: Function;
  withdrawAllFunds: Function;
  withdrawAllFundsEstimateGas: Function;
  signerAccount: string;
  account: string;
  GsnEnabled: boolean;
  ethToDaiRate: FormattedNumber;
}

export const CashOutForm = ( props: CashOutFormProps) => {
  const {
    closeAction,
    withdrawAllFunds,
    withdrawAllFundsEstimateGas,
    GsnEnabled,
    account,
    signerAccount,
    ethToDaiRate,
  } = props;
  const [gasCosts, setGasCosts] = useState(createBigNumber(TRANSFER_ETH_GAS_COST));
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState('');
  const [ethSignerBalance, setSignerEthBalance] = useState(0);
  const [ethBalance, setEthBalance] = useState(0);
  const [daiBalance, setDaiBalance] = useState(0);

  async function getGasCost(account) {
    const gasCosts = await withdrawAllFundsEstimateGas(account);
    setGasCosts(gasCosts);
  }

  async function getSignerBalances() {
    const ethSignerBalance = await getEthBalance(signerAccount);
    const daiBalance = await getDaiBalance(account);
    const ethBalance = await getEthBalance(account);
    setDaiBalance(daiBalance);
    setSignerEthBalance(ethSignerBalance);
    setEthBalance(ethBalance);
  }


  useEffect(() => {
    getGasCost(account);
    getSignerBalances();
  }, []);


  const addressChange = (address: string) => {
    let updatedErrors = '';
    if (address && !isAddress(address)) {
      updatedErrors = 'Address is invalid';
    }

    if (address === '') {
      updatedErrors = 'Address is required';
    }
    setAddress(address);
    setErrors(updatedErrors);
  };


  const totalDai = createBigNumber(daiBalance || 0);

  const totalEthInDai1 = ethToDai(ethSignerBalance || 0, createBigNumber(ethToDaiRate?.value || 0));
  const totalEthInDai2 = ethToDai(ethBalance || 0, createBigNumber(ethToDaiRate?.value || 0));
  const formattedTotalInDai = formatDai(totalDai.plus(totalEthInDai1.value).plus(totalEthInDai2.value));
  const gasInDai = getGasInDai(gasCosts || TRANSFER_ETH_GAS_COST);
  const gasEstimate = GsnEnabled
    ? displayGasInDai(gasCosts)
    : displayGasInDai(TRANSFER_ETH_GAS_COST);

  const formattedTotalMinusGasInDai = formatDai(formattedTotalInDai.value - gasInDai.value);

  const breakdown = [
    {
      label: 'Send',
      value: formattedTotalInDai,
    },
    {
      label: 'Transaction Fee',
      value: gasEstimate,
    },
    {
      label: 'Total',
      value: formattedTotalMinusGasInDai,
    },
  ];

  const isValid = errors.length === 0 && address.length > 0 && formattedTotalMinusGasInDai.value > 0;

  return (
    <div className={Styles.WithdrawForm}>
      <header>
        <div>
          <CloseButton action={() => closeAction()} />
        </div>
        <div>
          <h1>Cash Out all funds</h1>
          <h2>Withdraw all funds to another address</h2>
        </div>
      </header>

      <main>
        <div className={Styles.GroupedForm}>
          <div>
            <label htmlFor='recipient'>Recipient address</label>
            <TextInput
              type='text'
              value={address}
              placeholder='0x...'
              onChange={addressChange}
              errorMessage={errors.length > 0 ? errors : ''}
            />
          </div>
        </div>
        <Breakdown rows={breakdown} />
      </main>
      <div>
        <ProcessingButton
          text={'Send'}
          action={() => withdrawAllFunds(address)}
          queueName={TRANSACTIONS}
          queueId={WITHDRAWALLFUNDSASDAI}
          disabled={!isValid}
        />

        <SecondaryButton text={'Cancel'} action={closeAction} />
      </div>
    </div>
  );
}
