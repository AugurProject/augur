import React, { Component } from 'react';

import { ButtonsRow, Breakdown } from 'modules/modal/common';
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

interface TransferFormState {
  address: string;
  currency: string;
  amount: string;
  options: object[];
  errors: {
    address: string;
    amount: string;
  };
  relayerGasCosts: BigNumber;
  gasEstimate: string;
}

function sanitizeArg(arg) {
  return arg == null || arg === '' ? '' : arg;
}

export class TransferForm extends Component<
  TransferFormProps,
  TransferFormState
> {
  state: TransferFormState = {
    relayerGasCosts: createBigNumber(TRANSFER_ETH_GAS_COST),
    address: this.props.useSigner ? this.props.account : '',
    currency: DAI,
    gasEstimate: getGasInDai(this.props.fallBackGasCosts[DAI.toLowerCase()]).formatted,
    amount: '',
    errors: {
      address: '',
      amount: '',
    },
    options: this.props.useSigner ?
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
  };

  dropdownChange = (value: string) => {
    const { amount } = this.state;
    this.setState({ currency: value }, () => {
      if (amount.length) {
        this.amountChange(amount);
      }
    });
  };

  handleMax = () => {
    const { balances, useSigner } = this.props;
    const { currency } = this.state;
    const balance = useSigner
      ? balances.signerBalances[currency.toLowerCase()]
      : balances[currency.toLowerCase()];

    this.amountChange(balance);
  };

  amountChangeFromSigner = (amount: string, gasInEth: string) => {
    const { balances } = this.props;
    const { errors: updatedErrors, currency } = this.state;
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
    this.setErrorMessage(newAmount, updatedErrors, balance, amountMinusGas, false);
  }

  amountChange = (amount: string) => {
    const {
      balances,
      fallBackGasCosts,
      GsnEnabled,
      gasPrice,
      useSigner,
    } = this.props;
    const { errors: updatedErrors, currency } = this.state;
    const { relayerGasCosts } = this.state;
    let newAmount = convertExponentialToDecimal(sanitizeArg(amount)) || "0";

    const gas = fallBackGasCosts[currency.toLowerCase()];
    const gasInEth = formatGasCostToEther(gas, { decimals: 4}, createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice));

    if (useSigner) return this.amountChangeFromSigner(newAmount, gasInEth);

    const balance = balances[currency.toLowerCase()];
    let amountMinusGas = createBigNumber(balances.signerBalances.eth).minus(createBigNumber(gasInEth))
    if (!amountMinusGas.gt(ZERO)) {
      const relayerGasCostsDAI = getGasInDai(relayerGasCosts.multipliedBy(gasPrice));
      amountMinusGas = createBigNumber(balances.dai).minus(createBigNumber(relayerGasCostsDAI.value));
      if (currency === DAI) {
        newAmount = createBigNumber(newAmount).minus(createBigNumber(relayerGasCostsDAI.value));;
      }
    }

    this.setErrorMessage(newAmount, updatedErrors, balance, amountMinusGas, GsnEnabled);
  };

  setErrorMessage = (newAmount, updatedErrors, balance, amountMinusGas: BigNumber, GsnEnabled) => {
    updatedErrors.amount = '';
    const bnNewAmount = createBigNumber(newAmount || '0');
    // validation...
    if (newAmount === '' || newAmount === undefined) {
      updatedErrors.amount = 'Quantity is required.';
      return this.setState({ amount: newAmount, errors: updatedErrors });
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

    this.setState({ amount: String(newAmount), errors: updatedErrors });
  }

  componentDidMount() {
    const { useSigner, balances } = this.props;
    if (useSigner) {
      let currencies = [{
        label: DAI,
        value: DAI,
      }]

      if (balances.signerBalances.eth > 0) {
        currencies = currencies.concat({
          label: ETH,
          value: ETH,
        });
      }

      if (balances.signerBalances.rep > 0) {
        currencies = currencies.concat({
          label: REP,
          value: REP,
        });
      }

      this.setState({ options: currencies });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.currency && this.state.currency !== prevState.currency) {
      const formattedAmount =
        this.state.currency === ETH
          ? formatEther(Number(this.state.amount) || 0)
          : formatRep(this.state.amount || 0);

      const relayerGasCosts = await this.props.transferFundsGasEstimate(
        formattedAmount.fullPrecision,
        this.state.currency,
        this.state.address
          ? this.state.address
          : this.props.account
      );
      this.setState({
        relayerGasCosts,
      });
    }
  }

  addressChange = (address: string) => {
    const { errors: updatedErrors } = this.state;
    updatedErrors.address = '';
    if (address && !isAddress(address)) {
      updatedErrors.address = 'Address is invalid';
    }

    if (address === '') {
      updatedErrors.address = 'Address is required';
    }
    this.setState({ address, errors: updatedErrors });
  };

  render() {
    const {
      transferFunds,
      balances,
      closeAction,
      useSigner,
      transactionLabel,
    } = this.props;
    const { amount, currency, address, errors, gasEstimate } = this.state;
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
                onChange={this.addressChange}
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
                options={this.state.options}
                defaultValue={currency}
                onChange={this.dropdownChange}
              />
            </div>
            <div>
              <label htmlFor='amount'>Amount</label>
              <button onClick={this.handleMax}>MAX</button>
              <TextInput
                type='number'
                value={amount}
                placeholder='0.00'
                onChange={this.amountChange}
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
}
