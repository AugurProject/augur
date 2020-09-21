import React, { useEffect, useState } from 'react';

import { Breakdown } from 'modules/modal/common';
import { DAI, ETH, REP, ZERO, GWEI_CONVERSION, MAX_DECIMALS, TRANSACTIONS, TRANSFER, SENDETHER, UNI } from 'modules/common/constants';
import {
  formatEther,
  formatRep,
  formatDaiPrice,
  formatGasCostToEther,
  formatDai,
} from 'utils/format-number';
import isAddress from 'modules/auth/helpers/is-address';
import { createBigNumber, BigNumber } from 'utils/create-big-number';
import convertExponentialToDecimal from 'utils/convert-exponential';
import { FormDropdown, TextInput } from 'modules/common/form';
import { CloseButton, SecondaryButton, ProcessingButton } from 'modules/common/buttons';
import { getGasInDai } from 'modules/app/actions/get-ethToDai-rate';
import getPrecision from 'utils/get-number-precision';

import Styles from 'modules/modal/modal.styles.less';
import titleCase from 'utils/title-case';

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
  tokenName: string;
  autoClose: boolean;
}

function sanitizeArg(arg) {
  return arg == null || arg === '' ? '' : arg;
}

const RELAYER_DAI_CUSION = 0.25;
const TURN_OFF_TOP_OFF_PERCENTAGE = 0.9;

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
  signingEthBalance,
  tokenName,
  autoClose,
}: TransferFormProps) => {
  const [currency, setCurrency] = useState(DAI);
  const [signerPays, setSignerPays] = useState(true);
  const [amount, setAmount] = useState('');
  const [gasCosts, setGasCosts] = useState(
    createBigNumber(getGasInDai(fallBackGasCosts[DAI.toLowerCase()]).value)
  );
  const getOptions = () => {
    const tokenOptions = {
      [DAI]: {
        label: DAI,
        value: DAI,
      },
      [REP]: {
        label: REP,
        value: REP,
      },
      [ETH]: {
        label: ETH,
        value: ETH,
      },
      [UNI]: {
        label: UNI,
        value: UNI,
      }
    };
    if (useSigner && !tokenName) return [tokenOptions[DAI]];
    if (useSigner && tokenName) return [tokenOptions[tokenName]];
    return [tokenOptions[DAI], tokenOptions[ETH], tokenOptions[REP], tokenOptions[UNI]];
  };
  const [state, setState] = useState({
    address: useSigner ? account : '',
    gasEstimateInDai: getGasInDai(fallBackGasCosts[DAI.toLowerCase()]),
    errors: {
      address: '',
      amount: '',
    },
    options: getOptions()
  });

  async function getGasCost(currency) {
    let gasCosts = createBigNumber(fallBackGasCosts[currency.toLowerCase()]);
    try {
      gasCosts = await transferFundsGasEstimate(
        formattedAmount.fullPrecision,
        currency,
        state.address ? state.address : account
      );
    } catch (error) {
      console.error('can not get gas estimate', error);
    }
    const gasInEth = formatGasCostToEther(gasCosts, { decimals: 4}, createBigNumber(GWEI_CONVERSION).times(gasPrice));
    const signerPays = (createBigNumber(signingEthBalance).minus(gasInEth)).gte(ZERO);
    setSignerPays(signerPays);
    setGasCosts(createBigNumber(gasCosts))
    const estInDai = getGasInDai(Number(createBigNumber(gasCosts)));
    // TODO: figure out exact DAI amount needed to convert to eth.
    const gasEstimateInDai = signerPays ? estInDai : formatDai(createBigNumber(estInDai.value).plus(RELAYER_DAI_CUSION));
    setState({...state, gasEstimateInDai});
  }

  useEffect(() => {
    getGasCost(currency);
  }, [currency]);

  useEffect(() => {
    setCurrency(state.options[0].value);
  }, []);

  const handleMax = () => {
    const balance = useSigner
      ? balances.signerBalances[currency.toLowerCase()]
      : balances[currency.toLowerCase()];

    let newAmount = convertExponentialToDecimal(sanitizeArg(balance));
    if (!useSigner && !signerPays && currency === DAI) {
      newAmount = createBigNumber(newAmount).minus(createBigNumber(gasEstimateInDai.value));;
    }
    amountChange(newAmount);
  };

  const amountChangeFromSigner = (amount: string, gasInEth: string) => {
    const { errors: updatedErrors } = state;
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
    setErrorMessage(newAmount, updatedErrors, balance, amountMinusGas);
  }

  const amountChange = (amount: string) => {
    const { errors: updatedErrors } = state;
    let newAmount = convertExponentialToDecimal(sanitizeArg(amount)) || "0";

    const gasInEth = formatGasCostToEther(gasCosts, { decimals: 4}, createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice));

    if (useSigner) return amountChangeFromSigner(newAmount, gasInEth);

    const balance = balances[currency.toLowerCase()];
    let amountMinusGas = createBigNumber(balances.signerBalances.eth).minus(createBigNumber(gasInEth))
    if (!signerPays && currency === DAI) {
      amountMinusGas = createBigNumber(balances.dai).minus(createBigNumber(gasEstimateInDai.value));
    }

    setErrorMessage(newAmount, updatedErrors, balance, amountMinusGas);
  };

  const setErrorMessage = (newAmount, updatedErrors, balance, amountMinusGas: BigNumber) => {
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

    if ((!useSigner && !signerPays) && (amountMinusGas.lt(ZERO) || createBigNumber(newAmount).gt(amountMinusGas))) {
      updatedErrors.amount = `Not enough DAI available to pay transaction fee. ${
        formatDai(amountMinusGas.abs(), { roundDown: true }).roundedFormatted
      } is min`;
    }

    if ((useSigner || signerPays) && amountMinusGas.lt(ZERO)) {
      updatedErrors.amount = `Not enough ETH to pay transaction fee. ${amountMinusGas.abs()} is needed`;
    }

    if (getPrecision(newAmount, MAX_DECIMALS) > MAX_DECIMALS) {
      updatedErrors.amount = `Too many decimal places. ${MAX_DECIMALS} is allowed`;
    }

    setState({ ...state, errors: updatedErrors });
    setAmount(String(newAmount));
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

    const { address, errors, gasEstimateInDai } = state;
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
        value: gasEstimateInDai,
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
            <h1>Transfer {useSigner ? `my ${titleCase(tokenName)}` : 'funds'}</h1>
            <h2>Transfer {useSigner ? `${titleCase(tokenName)} to your Trading account` : 'funds to another address'}</h2>
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
                disabled={!(state.options.length > 1)}
                onChange={currency => {
                  setCurrency(currency)
                  setAmount('')
                }}
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
        <div className={Styles.ButtonsRow}>
          <ProcessingButton
            small
            text={'Send'}
            action={() => {
              let useTopOff = true;
              if (currency === DAI) {
                // if 90% or more of user's DAI is being transferred disable topping off fee reserve
                const percentage = createBigNumber(balances.dai).div(createBigNumber(formattedAmount.fullPrecision));
                if (percentage.gt(createBigNumber(TURN_OFF_TOP_OFF_PERCENTAGE))) {
                  useTopOff = false;
                }
              }
              transferFunds(formattedAmount.fullPrecision, currency, address, useSigner, useTopOff)
              if (autoClose) closeAction();
            }}
            queueName={TRANSACTIONS}
            queueId={currency === ETH ? SENDETHER : TRANSFER}
            disabled={!isValid}
          />
          <SecondaryButton
            text={'Cancel'}
            action={closeAction}
          />
        </div>
      </div>
    );

}
