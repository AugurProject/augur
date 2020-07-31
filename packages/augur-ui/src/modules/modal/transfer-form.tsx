import React, { useEffect, useState } from 'react';

import { Breakdown } from 'modules/modal/common';
import {
  DAI,
  ETH,
  REP,
  ZERO,
  GWEI_CONVERSION,
  MAX_DECIMALS,
  TRANSACTIONS,
  TRANSFER,
  SENDETHER,
} from 'modules/common/constants';
import {
  formatEther,
  formatRep,
  formatGasCostToEther,
  formatDai,
} from 'utils/format-number';
import isAddress from 'modules/auth/helpers/is-address';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { FormDropdown, TextInput } from 'modules/common/form';
import {
  CloseButton,
  SecondaryButton,
  ProcessingButton,
} from 'modules/common/buttons';
import getPrecision from 'utils/get-number-precision';
import { getGasCost } from './gas';
import { FormattedNumber } from 'modules/types';

import Styles from 'modules/modal/modal.styles.less';

interface TransferFormProps {
  closeAction: Function;
  transferFunds: Function;
  ethToDaiRate: FormattedNumber;
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
    };
  };
  gasPrice: number;
  transactionLabel: string;
  autoClose: boolean;
}

function sanitizeArg(arg) {
  return arg == null || arg === '' ? '' : arg;
}

export const TransferForm = ({
  closeAction,
  transferFunds,
  fallBackGasCosts,
  balances,
  gasPrice,
  ethToDaiRate,
  transactionLabel,
  autoClose,
}: TransferFormProps) => {
  const [currency, setCurrency] = useState(DAI);
  const [amount, setAmount] = useState('');
  const [gasLimit, setGasLimit] = useState(
    createBigNumber(fallBackGasCosts[DAI.toLowerCase()])
  );
  const [useSigner, setUseSigner] = useState(true);

  const getOptions = () => {
    const tokenOptions = {
      [DAI]: {
        label: DAI,
        value: DAI,
      },
      [REP]: {
        label: 'REPv2',
        value: REP,
      },
      [ETH]: {
        label: ETH,
        value: ETH,
      },
    };
    return [tokenOptions[DAI], tokenOptions[ETH], tokenOptions[REP]];
  };
  const [state, setState] = useState({
    address: '',
    errors: {
      address: '',
      amount: '',
    },
    options: getOptions(),
  });

  async function getGasLimit(currency) {
    const gasLimit = createBigNumber(fallBackGasCosts[currency.toLowerCase()]);
    setGasLimit(createBigNumber(gasLimit));
    setState({ ...state });
  }

  useEffect(() => {
    getGasLimit(currency);
  }, [currency]);

  useEffect(() => {
    setCurrency(state.options[0].value);
  }, []);

  const gasInEth = formatGasCostToEther(
    gasLimit,
    { decimals: 4 },
    createBigNumber(GWEI_CONVERSION).times(gasPrice)
  );
  const gasCostDai = getGasCost(gasLimit, gasPrice, ethToDaiRate);

  const handleMax = () => {
    const balance = balances.signerBalances[currency.toLowerCase()];

    let newAmount = convertExponentialToDecimal(sanitizeArg(balance));
    if (currency === DAI) {
      newAmount = createBigNumber(newAmount).minus(
        createBigNumber(gasCostDai.value)
      );
    }
    amountChange(newAmount);
  };

  const amountChangeFromSigner = (amount: string, gasInEth: string) => {
    const { errors: updatedErrors } = state;
    updatedErrors.amount = '';
    let newAmount = amount;
    const balance = balances.signerBalances[currency.toLowerCase()];
    const eth = balances.signerBalances.eth;
    let amountMinusGas = createBigNumber(eth).minus(createBigNumber(gasInEth));
    if (currency === ETH) {
      newAmount = createBigNumber(amount);
      if (createBigNumber(eth).eq(newAmount)) {
        newAmount = createBigNumber(eth).minus(createBigNumber(gasInEth));
      }
    }
    setErrorMessage(newAmount, updatedErrors, balance, amountMinusGas);
  };

  const amountChange = (amount: string) => {
    const { errors: updatedErrors } = state;
    const newAmount = convertExponentialToDecimal(sanitizeArg(amount)) || '0';

    return amountChangeFromSigner(newAmount, gasInEth);
  };

  const setErrorMessage = (
    newAmount,
    updatedErrors,
    balance,
    amountMinusGas: BigNumber
  ) => {
    updatedErrors.amount = '';
    const bnNewAmount = createBigNumber(newAmount || '0');
    // validation...
    if (newAmount === '' || newAmount === undefined) {
      updatedErrors.amount = 'Quantity is required.';
      setAmount(String(newAmount));
      return setState({ ...state, errors: updatedErrors });
    }

    if (!isFinite(Number(newAmount))) {
      updatedErrors.amount = "Quantity isn't finite.";
    }

    if (isNaN(parseFloat(String(newAmount)))) {
      updatedErrors.amount = "Quantity isn't a number.";
    }

    if (bnNewAmount.gt(createBigNumber(balance))) {
      updatedErrors.amount = 'Quantity is greater than available funds.';
    }

    if (bnNewAmount.lte(ZERO)) {
      updatedErrors.amount = 'Quantity must be greater than zero.';
    }

    if (amountMinusGas.lt(ZERO)) {
      updatedErrors.amount = `Not enough ETH to pay transaction fee. ${amountMinusGas.abs()} is needed`;
    }

    if (getPrecision(newAmount, MAX_DECIMALS) > MAX_DECIMALS) {
      updatedErrors.amount = `Too many decimal places. ${MAX_DECIMALS} is allowed`;
    }

    setState({ ...state, errors: updatedErrors });
    setAmount(String(newAmount));
  };

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

  const { address, errors } = state;
  const { amount: errAmount, address: errAddress } = errors;
  const isValid =
    errAmount === '' && errAddress === '' && amount.length && address.length;

  let formattedAmount = formatEther(amount || 0);

  if (currency === DAI) {
    formattedAmount = formatDai(amount || 0);
  } else if (currency === REP) {
    formattedAmount = formatRep(amount || 0);
  }

  const balance = balances.signerBalances[currency.toLowerCase()];

  const breakdown = [
    {
      label: 'Send',
      value: formattedAmount,
      showDenomination: true,
    },
    {
      label: transactionLabel,
      value: gasCostDai,
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
              <span>Available: {balance}</span>
            </div>
            <FormDropdown
              id="currency"
              options={state.options}
              defaultValue={currency}
              disabled={!(state.options.length > 1)}
              onChange={currency => {
                setCurrency(currency);
                setAmount('');
              }}
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
      <div className={Styles.ButtonsRow}>
        <ProcessingButton
          small
          text={'Send'}
          action={() => {
            transferFunds(formattedAmount.fullPrecision, currency, address);
            if (autoClose) closeAction();
          }}
          queueName={TRANSACTIONS}
          queueId={currency === ETH ? SENDETHER : TRANSFER}
          disabled={!isValid}
        />
        <SecondaryButton text={'Cancel'} action={closeAction} />
      </div>
    </div>
  );
};
