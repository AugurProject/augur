import React, { useEffect, useState } from 'react';

import { Breakdown } from 'modules/modal/common';
import { formatDai } from 'utils/format-number';
import isAddress from 'modules/auth/helpers/is-address';
import Styles from 'modules/modal/modal.styles.less';
import { createBigNumber } from 'utils/create-big-number';
import { FormattedNumber } from 'modules/types';
import { TextInput } from 'modules/common/form';
import {
  CloseButton,
  ProcessingButton,
  SecondaryButton,
} from 'modules/common/buttons';
import { TRANSFER_DAI_GAS_COST } from 'modules/auth/actions/transfer-funds';
import { getGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import {
  WITHDRAWALLFUNDSASDAI,
  TRANSACTIONS,
  NOT_USE_ETH_RESERVE,
  TRANSFER,
} from 'modules/common/constants';
import { AutoCancelOrdersNotice } from 'modules/common/labels';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { ethToDai } from 'modules/app/actions/get-ethToDai-rate';

interface CashOutFormProps {
  closeAction: Function;
  withdrawAllFunds: Function;
  transferFunds: Function;
  withdrawAllFundsEstimateGas: Function;
  transferFundsGasEstimate: Function;
  account: string;
  gasPrice: number;
  totalOpenOrderFundsFormatted: FormattedNumber;
  availableFundsFormatted: FormattedNumber;
  reserveInDaiFormatted: FormattedNumber;
  totalDaiFormatted: FormattedNumber;
  tradingAccountEthFormatted: FormattedNumber;
  totalDai: string;
  accountFunds: any;
  ethReserveAmount: any;
}

export const CashOutForm = ({
  closeAction,
  accountFunds,
  withdrawAllFunds,
  ethReserveAmount,
  transferFunds,
  withdrawAllFundsEstimateGas,
  transferFundsGasEstimate,
  account,
  gasPrice,
  totalOpenOrderFundsFormatted,
  availableFundsFormatted,
  tradingAccountEthFormatted,
  totalDai,
}: CashOutFormProps) => {
  const [gasCosts, setGasCosts] = useState(
    createBigNumber(TRANSFER_DAI_GAS_COST)
  );
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState('');
  const [signerPays, setSignerPays] = useState(true);

  const { ethToDaiRate, loginAccount: { totalOpenOrdersFrozenFunds } } = useAppStatusStore();

  const reserveInDaiFormatted = ethToDai(ethReserveAmount.value || 0, createBigNumber(ethToDaiRate?.value || 0));
  const totalDaiFormatted = formatDai(createBigNumber(totalOpenOrdersFrozenFunds).plus(createBigNumber(accountFunds.totalAvailableTradingBalance).plus(reserveInDaiFormatted.value)));

  async function getGasCost(account) {
    let gasCosts = createBigNumber(TRANSFER_DAI_GAS_COST);
    let signerPays = true;
    try {
      gasCosts = await withdrawAllFundsEstimateGas(account);
    } catch (error) {
      // user can't withdraw all funds, needs to transfer
      signerPays = false;
    }
    setSignerPays(signerPays);
    if (signerPays) {
      return setGasCosts(createBigNumber(gasCosts));
    }
    const testHalfDaiAmount = String(createBigNumber(totalDai).div(2));
    const relayerGasCosts = await transferFundsGasEstimate(
      testHalfDaiAmount,
      account
    );
    setGasCosts(createBigNumber(relayerGasCosts));
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

  const gasInDai = getGasInDai(
    createBigNumber(gasCosts).times(createBigNumber(gasPrice))
  );
  const formattedTotalMinusGasInDai = signerPays
    ? formatDai(totalDai)
    : formatDai(
        createBigNumber(totalDai).minus(createBigNumber(gasInDai.value))
      );

  const breakdown = [
    {
      label: 'Available Funds',
      value: availableFundsFormatted,
      showDenomination: true,
    },
  ];

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
    value: totalDaiFormatted,
    showDenomination: true,
  });

  const isValid =
    errors.length === 0 &&
    address.length > 0 &&
    formattedTotalMinusGasInDai.value > 0;

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
            <label htmlFor="recipient">Recipient address</label>
            <TextInput
              type="text"
              value={address}
              placeholder="0x..."
              onChange={addressChange}
              errorMessage={errors.length > 0 ? errors : ''}
            />
          </div>
        </div>
        <Breakdown rows={breakdown} />
        {totalOpenOrderFundsFormatted.value > 0 && <AutoCancelOrdersNotice />}
      </main>
      <div>
        <ProcessingButton
          text={'Send'}
          action={() =>
            action(
              address,
              signerPays,
              formattedTotalMinusGasInDai.fullPrecision
            )
          }
          queueName={TRANSACTIONS}
          queueId={signerPays ? WITHDRAWALLFUNDSASDAI : TRANSFER}
          disabled={!isValid}
        />

        <SecondaryButton text={'Cancel'} action={closeAction} />
      </div>
    </div>
  );
};
