import React, { useEffect, useState } from 'react';

import { Breakdown } from 'modules/modal/common';
import { DAI, ETH, REP, ZERO, GWEI_CONVERSION, MAX_DECIMALS, TRANSACTIONS, TRANSFER } from 'modules/common/constants';
import {
  formatEther,
  formatRep,
  formatDai,
  formatGasCostToEther,
} from 'utils/format-number';
import isAddress from 'modules/auth/helpers/is-address';
import Styles from 'modules/modal/modal.styles.less';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { FormDropdown, TextInput } from 'modules/common/form';
import { CloseButton, SecondaryButton, ProcessingButton } from 'modules/common/buttons';
import { TRANSFER_ETH_GAS_COST } from 'modules/auth/actions/transfer-funds';
import { getGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import getPrecision from 'utils/get-number-precision';

interface TransferFormProps {
  closeAction: Function;
  transferFunds: Function;
  transferFundsGasEstimate: Function;
  fallBackGasCosts: {
    eth: number;
    rep: number;
    dai: number;
  };
  balances: {
    eth: number;
    rep: number;
    dai: number;
    signerBalances: {
      eth: number;
      dai: number;
      rep: number;
    }
  };
  account: string;
  GsnEnabled: boolean;
  gasPrice: number;
  useSigner?: boolean;
  signerAddress?: string;
  transactionLabel: string;
  signingEthBalance: string;
}

function sanitizeArg(arg) {
  return arg == null || arg === '' ? '' : arg;
}

export const TransferForm = ({
  closeAction,
  transferFunds,
  transferFundsGasEstimate,
  fallBackGasCosts,
  balances,
  account,
  gasPrice,
  useSigner,
  transactionLabel,
  GsnEnabled,
}: TransferFormProps) => {
  const [state, setState] = useState({
    relayerGasCosts: createBigNumber(TRANSFER_ETH_GAS_COST),
    address: '',
    currency: DAI,
    gasEstimate: getGasInDai(fallBackGasCosts[DAI.toLowerCase()]).formatted,
    amount: '',
    errors: {
      address: '',
      amount: '',
    },
    options: useSigner ?
    [{
      label: DAI,
      value: DAI,
    }] :
    [{
      label: DAI,
      value: DAI,
    },
    {
      label: ETH,
      value: ETH,
    },
    {
      label: REP,
      value: REP,
    },
  ]
  });

  useEffect(() => {
    const formattedAmount =
      state.currency === ETH
        ? formatEther(Number(state.amount) || 0)
        : formatRep(state.amount || 0);

    const relayerGasCosts = transferFundsGasEstimate(
      formattedAmount.fullPrecision,
      state.currency,
      state.address ? state.address : account
    );

    setState({
      ...state,
      relayerGasCosts: createBigNumber(relayerGasCosts),
    });
  }, [state.currency]);

  const handleMax = () => {
    const { currency } = state;
    const balance = useSigner
      ? balances.signerBalances[currency.toLowerCase()]
      : balances[currency.toLowerCase()];

    amountChange(balance);
  };

  const amountChangeFromSigner = (amount: string, gasInEth: string) => {
    const { errors: updatedErrors, currency } = state;
    updatedErrors.amount = '';
    let newAmount = amount;
    const balance = balances.signerBalances[currency.toLowerCase()];
    const eth = balances.signerBalances.eth;
    let amountMinusGas = createBigNumber(eth).minus(createBigNumber(gasInEth))
    if (currency === ETH) {
      newAmount = createBigNumber(amount);
      if (createBigNumber(eth).eq(newAmount)) {
        newAmount = createBigNumber(eth).minus(createBigNumber(gasInEth))
      }
    }
    setErrorMessage(newAmount, updatedErrors, balance, amountMinusGas, false);
  }

  const amountChange = (amount: string, currency: string = state.currency) => {
    const { errors: updatedErrors } = state;
    const { relayerGasCosts } = state;
    let newAmount = convertExponentialToDecimal(sanitizeArg(amount)) || "0";

    const gas = fallBackGasCosts[currency.toLowerCase()];
    const gasInEth = formatGasCostToEther(gas, { decimals: 4}, createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice));

    if (useSigner) return amountChangeFromSigner(newAmount, gasInEth);

    const balance = balances[currency.toLowerCase()];
    let amountMinusGas = createBigNumber(balances.signerBalances.eth).minus(createBigNumber(gasInEth))
    if (!amountMinusGas.gt(ZERO)) {
      const relayerGasCostsDAI = getGasInDai(relayerGasCosts.multipliedBy(gasPrice));
      amountMinusGas = createBigNumber(balances.dai).minus(createBigNumber(relayerGasCostsDAI.value));
      if (currency === DAI) {
        newAmount = createBigNumber(newAmount).minus(createBigNumber(relayerGasCostsDAI.value));;
      }
    }

    setErrorMessage(newAmount, updatedErrors, balance, amountMinusGas, GsnEnabled);
  };

  const setErrorMessage = (newAmount, updatedErrors, balance, amountMinusGas: BigNumber, GsnEnabled) => {
    updatedErrors.amount = '';
    const bnNewAmount = createBigNumber(newAmount || '0');
    // validation...
    if (newAmount === '' || newAmount === undefined) {
      updatedErrors.amount = 'Quantity is required.';
      return setState({ ...state, amount: newAmount, errors: updatedErrors });
    }

    if (!isFinite(Number(newAmount))) {
      updatedErrors.amount = "Quantity isn't finite.";
    }

    if (isNaN(parseFloat(String(newAmount)))) {
      updatedErrors.amount = "Quantity isn't a number.";
    }

    if (
      bnNewAmount.gt(
        createBigNumber(balance)
      )
    ) {
      updatedErrors.amount = 'Quantity is greater than available funds.';
    }

    if (bnNewAmount.lte(ZERO)) {
      updatedErrors.amount = 'Quantity must be greater than zero.';
    }

    if (GsnEnabled && amountMinusGas.lt(ZERO)) {
      updatedErrors.amount = `Not enough DAI available to pay gas cost. ${amountMinusGas.abs()} is needed`;
    }

    if (!GsnEnabled && amountMinusGas.lt(ZERO)) {
      updatedErrors.amount = `Not enough ETH to pay gas cost. ${amountMinusGas.abs()} is needed`;
    }

    if (getPrecision(newAmount, MAX_DECIMALS) > MAX_DECIMALS) {
      updatedErrors.amount = `Too many decimal places. ${MAX_DECIMALS} is allowed`;
    }

    setState({ ...state, amount: String(newAmount), errors: updatedErrors });
  }


  const addressChange = (address: string) => {
    const { errors: updatedErrors } = state;
    updatedErrors.address = '';
    if (address && !isAddress(address)) {
      updatedErrors.address = 'Address is invalid';
    }

    if (address === '') {
      updatedErrors.address = 'Address is required';
    }
    setState({ ...state, address, errors: updatedErrors });
  };

    const { amount, currency, address, errors, gasEstimate } = state;
    const { amount: errAmount, address: errAddress } = errors;
    const isValid =
      errAmount === '' && errAddress === '' && amount.length && address.length;

    let formattedAmount = formatEther(amount || 0);

    if (currency === DAI) {
      formattedAmount = formatDai(amount || 0);
    } else if (currency === REP) {
      formattedAmount = formatRep(amount || 0);
    }

    const balance = useSigner
      ? balances.signerBalances[currency.toLowerCase()]
      : balances[currency.toLowerCase()];

    const breakdown = [
      {
        label: 'Send',
        value: formattedAmount,
        showDenomination: true,
      },
      {
        label: transactionLabel,
        value: formatDai(gasEstimate),
        showDenomination: true,
      },
    ];

    return (
      <div className={Styles.WithdrawForm}>
        <header>
          <div>
            <CloseButton action={() => closeAction()} />
          </div>
          <div>
            <h1>Transfer {useSigner ? 'my Dai' : 'funds'}</h1>
            <h2>Transfer {useSigner ? 'Dai to your Trading account' : 'funds to another address'}</h2>
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
                disabled={useSigner}
                onChange={addressChange}
                errorMessage={errors.address.length > 0 ? errors.address : ''}
              />
            </div>
            <div>
              <div>
                <label htmlFor='currency'>Currency</label>
                <span>Available: {balance}</span>
              </div>
              <FormDropdown
                id='currency'
                options={state.options}
                defaultValue={currency}
                onChange={currency => amountChange(state.amount, currency)}
              />
            </div>
            <div>
              <label htmlFor='amount'>Amount</label>
              <button onClick={handleMax}>MAX</button>
              <TextInput
                type='number'
                value={amount}
                placeholder='0.00'
                onChange={amountChange}
                errorMessage={
                  errors.amount && errors.amount.length > 0 ? errors.amount : ''
                }
              />
            </div>
          </div>
          <Breakdown rows={breakdown} />
        </main>
        <div>
          <ProcessingButton
            text={'Send'}
            action={() => transferFunds(formattedAmount.fullPrecision, currency, address, useSigner)}
            queueName={TRANSACTIONS}
            queueId={TRANSFER}
            disabled={!isValid}
          />
          <SecondaryButton text={'Cancel'} action={closeAction} />
        </div>
      </div>
    );

}
