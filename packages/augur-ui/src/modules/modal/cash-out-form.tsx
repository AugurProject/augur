import React, { useEffect, useState } from 'react';

import { Breakdown } from 'modules/modal/common';
import { formatDaiPrice, formatGasCostToEther, formatNumber, formatDai } from 'utils/format-number';
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
  FEE_RESERVES_LABEL,
  GWEI_CONVERSION,
} from 'modules/common/constants';
import { AutoCancelOrdersNotice, InsufficientFundsNotice } from 'modules/common/labels';

interface CashOutFormProps {
  closeAction: Function;
  withdrawAllFunds: Function;
  transferFunds: Function;
  withdrawAllFundsEstimateGas: Function;
  transferFundsGasEstimate: Function;
  GsnEnabled: boolean;
  ethToDaiRate: FormattedNumber;
  gasPrice: number;
  totalOpenOrderFundsFormatted: FormattedNumber;
  availableFundsFormatted: FormattedNumber;
  reserveInDaiFormatted: FormattedNumber;
  totalDaiFormatted: FormattedNumber;
  tradingAccountEthFormatted: FormattedNumber;
  totalDai: string;
  signerEth: string;
}

const GAS_EST_MULTIPLIER = 4;

export const CashOutForm = ({
  closeAction,
  withdrawAllFunds,
  transferFunds,
  withdrawAllFundsEstimateGas,
  transferFundsGasEstimate,
  gasPrice,
  totalOpenOrderFundsFormatted,
  availableFundsFormatted,
  reserveInDaiFormatted,
  totalDaiFormatted,
  tradingAccountEthFormatted,
  totalDai,
  signerEth,
}: CashOutFormProps) => {
  const [gasCosts, setGasCosts] = useState(
    createBigNumber(0)
  );
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState('');
  const [signerPays, setSignerPays] = useState(true);
  const [gasInDai, setGasInDai] = useState(formatNumber(0));
  const [amountDai, setAmountDai] = useState(formatDai(0));
  const [insufficientFunds, setInsufficientFunds] = useState(false);

  async function getGasCost(account) {
    let gas = gasCosts;
    let signerPays = true;
    try {
      // add buffer to gas
      gas = (await withdrawAllFundsEstimateGas(account)).times(GAS_EST_MULTIPLIER);
      const gasCostInEth = formatGasCostToEther(gas, {}, createBigNumber(GWEI_CONVERSION).multipliedBy(createBigNumber(gasPrice)));
      signerPays = createBigNumber(signerEth).gte(createBigNumber(gasCostInEth));
    } catch (error) {
      // user can't withdraw all funds, needs to transfer
      signerPays = false;
    }
    setSignerPays(signerPays);
    if (signerPays) {
      setGasInDai(getGasInDai(
        createBigNumber(gas), createBigNumber(GWEI_CONVERSION).times(createBigNumber(gasPrice))
      ));
      setAmountDai(formatDai(totalDai));
      return setGasCosts(gas);
    }
    estimateTransfer(account);
  }

  const estimateTransfer = async (account) => {
    const testHalfDaiAmount = String(createBigNumber(totalDai).div(2));
    let gas = TRANSFER_DAI_GAS_COST;
    try {
      gas = await transferFundsGasEstimate(
        testHalfDaiAmount,
        account
      );
    } catch (e) {
      // user doesn't have enough DAI to pay relayer cost.
    }
    const gasInDaiEstimate = getGasInDai(
      createBigNumber(gas), createBigNumber(GWEI_CONVERSION).times(createBigNumber(gasPrice))
    );
    const daiAmount = formatDai(
      createBigNumber(totalDai).minus(createBigNumber(gasInDaiEstimate.value))
    );
    if (createBigNumber(daiAmount.value).lt(0)) {
      setInsufficientFunds(true);
    }
    setGasInDai(gasInDaiEstimate);
    setAmountDai(daiAmount);
    setGasCosts(createBigNumber(gas));
  }
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
    if (!updatedErrors) {
      getGasCost(address);
    }
  };

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
      label: FEE_RESERVES_LABEL,
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
    value: signerPays ? totalDaiFormatted : amountDai,
    showDenomination: true,
  });

  const isValid =
    errors.length === 0 &&
    address.length > 0 &&
    amountDai.value > 0;

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
        {insufficientFunds && <InsufficientFundsNotice />}
      </main>
      <div>
        <ProcessingButton
          text={'Send'}
          action={() =>
            action(
              address,
              signerPays,
              amountDai.fullPrecision
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
