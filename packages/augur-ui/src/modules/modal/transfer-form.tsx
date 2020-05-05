import React, { useState } from 'react';

import { ButtonsRow, Breakdown } from 'modules/modal/common';
import { DAI, ETH, REP, ZERO } from 'modules/common/constants';
import { formatEther, formatRep, formatDai } from 'utils/format-number';
import isAddress from 'modules/auth/helpers/is-address';
import Styles from 'modules/modal/modal.styles.less';
import { createBigNumber } from 'utils/create-big-number';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { FormattedNumber } from 'modules/types';
import { FormDropdown, TextInput } from 'modules/common/form';
import { CloseButton } from 'modules/common/buttons';
import { TRANSFER_ETH_GAS_COST } from 'modules/auth/actions/transfer-funds';
import {
  displayGasInDai,
  getGasInDai,
} from 'modules/app/actions/get-ethToDai-rate';
import { useAppStatusStore } from 'modules/app/store/app-status';
import { useEffect } from 'react';

interface TransferFormProps {
  closeAction: Function;
  transferFunds: Function;
  transferFundsGasEstimate: Function;
  fallBackGasCosts: {
    eth: FormattedNumber;
    rep: FormattedNumber;
    dai: FormattedNumber;
  };
  balances: {
    eth: number;
    rep: number;
    dai: number;
  };
  account: string;
  gasPrice: number;
}

function sanitizeArg(arg) {
  return arg == null || arg === '' ? '' : arg;
}

const options = [
  {
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
];

export const TransferForm = ({
  closeAction,
  transferFunds,
  transferFundsGasEstimate,
  fallBackGasCosts,
  balances,
  account,
  gasPrice,
}: TransferFormProps) => {
  const [state, setState] = useState({
    relayerGasCosts: createBigNumber(TRANSFER_ETH_GAS_COST),
    address: '',
    currency: ETH,
    amount: '',
    errors: {
      address: '',
      amount: '',
    },
  });
  const { gsnEnabled } = useAppStatusStore();

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

  function addressChange(address: string) {
    const updatedErrors = state.errors;
    updatedErrors.address = '';
    if (address && !isAddress(address)) {
      updatedErrors.address = 'Address is invalid';
    }

    if (address === '') {
      updatedErrors.address = 'Address is required';
    }
    setState({ ...state, address, errors: updatedErrors });
  }

  function handleMax() {
    const { currency, relayerGasCosts } = state;

    const gasEstimate = gsnEnabled
      ? getGasInDai(relayerGasCosts.multipliedBy(gasPrice))
      : fallBackGasCosts[currency.toLowerCase()];

    const fullAmount = createBigNumber(balances[currency.toLowerCase()]);
    const valueMinusGas = !gsnEnabled
      ? fullAmount.minus(createBigNumber(gasEstimate.value))
      : fullAmount;
    const resolvedValue = valueMinusGas.lt(ZERO) ? ZERO : valueMinusGas;
    amountChange(resolvedValue.toFixed(), false);
  }

  function amountChange(
    amount: string,
    dontCheckMinusGas: boolean = false,
    currency = state.currency
  ) {
    const { errors: updatedErrors, relayerGasCosts } = state;
    const newAmount = convertExponentialToDecimal(sanitizeArg(amount));
    const bnNewAmount = createBigNumber(newAmount || '0');
    updatedErrors.amount = '';
    const availableEth = createBigNumber(balances.eth);
    const availableDai = createBigNumber(balances.dai);
    let amountMinusGas = ZERO;

    if (gsnEnabled) {
      const gasCost = relayerGasCosts.multipliedBy(gasPrice);
      const relayerGasCostsDAI = getGasInDai(gasCost);
      if (currency === DAI) {
        if (dontCheckMinusGas) {
          amountMinusGas = availableDai.minus(bnNewAmount);
        } else {
          amountMinusGas = availableDai
            .minus(bnNewAmount)
            .minus(createBigNumber(relayerGasCostsDAI.value));
        }
      } else {
        amountMinusGas = availableDai.minus(
          createBigNumber(relayerGasCostsDAI.value)
        );
      }
    } else {
      if (currency === ETH && newAmount) {
        amountMinusGas = availableEth
          .minus(bnNewAmount)
          .minus(fallBackGasCosts.eth.fullPrecision);
      } else {
        amountMinusGas =
          currency === DAI
            ? availableEth.minus(fallBackGasCosts.dai.fullPrecision)
            : availableEth.minus(fallBackGasCosts.rep.fullPrecision);
      }
    }
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

    if (bnNewAmount.gt(createBigNumber(balances[currency.toLowerCase()]))) {
      updatedErrors.amount = 'Quantity is greater than available funds.';
    }

    if (bnNewAmount.lte(ZERO)) {
      updatedErrors.amount = 'Quantity must be greater than zero.';
    }

    if (gsnEnabled && amountMinusGas.lt(ZERO)) {
      updatedErrors.amount = 'Not enough DAI available to pay gas cost.';
    }

    if (!gsnEnabled && amountMinusGas.lt(ZERO)) {
      updatedErrors.amount = 'Not enough ETH available to pay gas cost.';
    }

    setState({ ...state, currency, amount: newAmount, errors: updatedErrors });
  }

  const { relayerGasCosts, amount, currency, address, errors } = state;
  const { amount: errAmount, address: errAddress } = errors;
  const isValid =
    errAmount === '' && errAddress === '' && amount.length && address.length;

  let formattedAmount = formatEther(amount || 0);

  if (currency === DAI) {
    formattedAmount = formatDai(amount || 0);
  } else if (currency === REP) {
    formattedAmount = formatRep(amount || 0);
  }
  const gasEstimate = gsnEnabled
    ? displayGasInDai(relayerGasCosts)
    : fallBackGasCosts[currency.toLowerCase()];

  const buttons = [
    {
      text: 'Send',
      action: () =>
        transferFunds(formattedAmount.fullPrecision, currency, address),
      disabled: !isValid,
    },
    {
      text: 'Cancel',
      action: closeAction,
    },
  ];
  const breakdown = [
    {
      label: 'Send',
      value: formattedAmount,
    },
    {
      label: 'Transaction Fee',
      value: gasEstimate,
    },
  ];
  return (
    <div className={Styles.WithdrawForm}>
      <header>
        <div>
          <CloseButton action={() => closeAction()} />
        </div>
        <div>
          <h1>Transfer funds</h1>
          <h2>Transfer funds to another address</h2>
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
              errorMessage={errors.address.length > 0 ? errors.address : ''}
            />
          </div>
          <div>
            <div>
              <label htmlFor="currency">Currency</label>
              <span>Available: {balances[currency.toLowerCase()]}</span>
            </div>
            <FormDropdown
              id="currency"
              options={options}
              defaultValue={currency}
              onChange={currency => amountChange(state.amount, false, currency)}
            />
          </div>
          <div>
            <label htmlFor="amount">Amount</label>
            <button onClick={handleMax}>MAX</button>
            <TextInput
              type="number"
              value={amount}
              placeholder="0.00"
              onChange={amountChange}
              errorMessage={
                errors.amount && errors.amount.length > 0 ? errors.amount : ''
              }
            />
          </div>
        </div>
        <Breakdown rows={breakdown} />
      </main>
      <ButtonsRow buttons={buttons} />
    </div>
  );
};
