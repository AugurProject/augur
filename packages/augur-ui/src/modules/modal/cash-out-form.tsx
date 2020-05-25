import React, { useEffect, useState } from 'react';

import { Breakdown } from 'modules/modal/common';
import {
  formatDai, formatGasCostToEther,
} from 'utils/format-number';
import isAddress from 'modules/auth/helpers/is-address';
import Styles from 'modules/modal/modal.styles.less';
import { createBigNumber } from 'utils/create-big-number';
import { FormattedNumber } from 'modules/types';
import { TextInput } from 'modules/common/form';
import { CloseButton, ProcessingButton, SecondaryButton } from 'modules/common/buttons';
import { TRANSFER_ETH_GAS_COST } from 'modules/auth/actions/transfer-funds';
import { displayGasInDai, getGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { WITHDRAWALLFUNDSASDAI, TRANSACTIONS, GWEI_CONVERSION } from 'modules/common/constants';
import { AutoCancelOrdersNotice } from 'modules/common/labels';

interface CashOutFormProps {
  closeAction: Function;
  withdrawAllFunds: Function;
  withdrawAllFundsEstimateGas: Function;
  account: string;
  GsnEnabled: boolean;
  ethToDaiRate: FormattedNumber;
  gasPrice: number;
  totalOpenOrderFundsFormatted: FormattedNumber;
  availableFundsFormatted: FormattedNumber;
  reserveInDaiFormatted: FormattedNumber;
  totalDaiFormatted: FormattedNumber;
  transactionLabel: string;
}

export const CashOutForm = ( props: CashOutFormProps) => {
  const {
    closeAction,
    withdrawAllFunds,
    withdrawAllFundsEstimateGas,
    GsnEnabled,
    account,
    gasPrice,
    totalOpenOrderFundsFormatted,
    availableFundsFormatted,
    reserveInDaiFormatted,
    totalDaiFormatted,
    transactionLabel
  } = props;
  const [gasCosts, setGasCosts] = useState(createBigNumber(TRANSFER_ETH_GAS_COST));
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState('');

  async function getGasCost(account) {
    const gasCosts = await withdrawAllFundsEstimateGas(account);
    setGasCosts(gasCosts);
  }

  useEffect(() => {
    getGasCost(account);
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

  const gasLimit = createBigNumber(gasCosts || TRANSFER_ETH_GAS_COST);
  const gasInDai = getGasInDai(gasLimit.multipliedBy(gasPrice));
  const gasEstimateInEth = formatGasCostToEther(
    TRANSFER_ETH_GAS_COST,
    { decimalsRounded: 4 },
    createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice)
  );

  const gasEstimate = GsnEnabled
  ? displayGasInDai(gasLimit)
  : gasEstimateInEth;

  const formattedTotalMinusGasInDai = formatDai(totalDaiFormatted.value - gasInDai.value);

  const breakdown = [
    {
      label: 'Available Funds',
      value: availableFundsFormatted.formatted,
      showDenomination: true,
    },
    {
      label: 'Open Orders (Funds Held)',
      value: totalOpenOrderFundsFormatted.formatted,
      showDenomination: true,
    },
    {
      label: 'ETH Reserve',
      value: reserveInDaiFormatted.formatted,
      showDenomination: true,
    },
    {
      label: transactionLabel,
      value: gasInDai.full,
    },
    {
      label: 'Total',
      value: formattedTotalMinusGasInDai,
      showDenomination: true,
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
          <h1>Withdraw all funds</h1>
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
        <AutoCancelOrdersNotice />
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
