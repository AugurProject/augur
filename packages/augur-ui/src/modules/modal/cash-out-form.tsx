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
import { TRANSFER_ETH_GAS_COST, TRANSFER_DAI_GAS_COST } from 'modules/auth/actions/transfer-funds';
import { getGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import { WITHDRAWALLFUNDSASDAI, TRANSACTIONS, GWEI_CONVERSION, NOT_USE_ETH_RESERVE, ZERO, TRANSFER } from 'modules/common/constants';
import { AutoCancelOrdersNotice } from 'modules/common/labels';

interface CashOutFormProps {
  closeAction: Function;
  withdrawAllFunds: Function;
  transferFunds: Function;
  withdrawAllFundsEstimateGas: Function;
  transferFundsGasEstimate: Function;
  account: string;
  GsnEnabled: boolean;
  ethToDaiRate: FormattedNumber;
  gasPrice: number;
  totalOpenOrderFundsFormatted: FormattedNumber;
  availableFundsFormatted: FormattedNumber;
  reserveInDaiFormatted: FormattedNumber;
  totalDaiFormatted: FormattedNumber;
  tradingAccountEthFormatted: FormattedNumber;
  signingEthBalance: string;
}

export const CashOutForm = ( props: CashOutFormProps) => {
  const {
    closeAction,
    withdrawAllFunds,
    transferFunds,
    withdrawAllFundsEstimateGas,
    transferFundsGasEstimate,
    account,
    gasPrice,
    totalOpenOrderFundsFormatted,
    availableFundsFormatted,
    reserveInDaiFormatted,
    totalDaiFormatted,
    tradingAccountEthFormatted,
    signingEthBalance
  } = props;
  const [gasCosts, setGasCosts] = useState(createBigNumber(TRANSFER_ETH_GAS_COST));
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState('');
  const [signerPays, setSignerPays] = useState(true);

  async function getGasCost(account) {
    try {
      const gasCosts = await withdrawAllFundsEstimateGas(account);
      setGasCosts(gasCosts);
    } catch (error) {
      // user can't withdraw all funds, needs to transfer
      setSignerPays(false);
    }
    const testHalfDaiAmount = String(createBigNumber(tradingAccountEthFormatted.value).div(2));
    const relayerGasCosts = await transferFundsGasEstimate(testHalfDaiAmount, account);
    setGasCosts(relayerGasCosts.times(2.5));
  }

  useEffect(() => {
    getGasCost(account);
  }, []);

  const action = (address, signerPays, amount) => {
    return signerPays
      ? withdrawAllFunds(address)
      : transferFunds(amount, address);
  };

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

  const gasLimit = signerPays && createBigNumber(gasCosts || TRANSFER_ETH_GAS_COST);
  const gasInDai = getGasInDai(gasLimit.multipliedBy(gasPrice));
  const formattedTotalMinusGasInDai = signerPays ? formatDai(totalDaiFormatted.value) : formatDai(createBigNumber(totalDaiFormatted.value).minus(createBigNumber(gasInDai.value)));

  const breakdown = [
    {
      label: 'Available Funds',
      value: availableFundsFormatted,
      showDenomination: true,
    }];

    if (totalOpenOrderFundsFormatted.value > 0) {
      breakdown.push({
        label: 'Open Orders (Funds Held)',
        value: totalOpenOrderFundsFormatted,
        showDenomination: true,
      });
    }

    if (reserveInDaiFormatted.value > 0) {
      breakdown.push({
        label: 'Fee reserve',
        value: reserveInDaiFormatted,
        showDenomination: true,
      });
    }

    if (tradingAccountEthFormatted.value > 0) {
      breakdown.push({
        label: 'ETH',
        value: tradingAccountEthFormatted,
        showDenomination: true,
      });
    }

    breakdown.push({
      label: NOT_USE_ETH_RESERVE,
      value: gasInDai,
      showDenomination: true,
    });

    breakdown.push({
      label: 'Total',
      value: formattedTotalMinusGasInDai,
      showDenomination: true,
    });


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
        { totalOpenOrderFundsFormatted.value > 0 && <AutoCancelOrdersNotice /> }
      </main>
      <div>
        <ProcessingButton
          text={'Send'}
          action={() => action(address, signerPays, formattedTotalMinusGasInDai.fullPrecision)}
          queueName={TRANSACTIONS}
          queueId={signerPays ? WITHDRAWALLFUNDSASDAI : TRANSFER}
          disabled={!isValid}
        />

        <SecondaryButton text={'Cancel'} action={closeAction} />
      </div>
    </div>
  );
}
