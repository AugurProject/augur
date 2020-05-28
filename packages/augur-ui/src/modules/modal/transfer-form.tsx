import React, { Component } from 'react';

import { ButtonsRow, Breakdown } from 'modules/modal/common';
import { DAI, ETH, REP, ZERO, GWEI_CONVERSION } from 'modules/common/constants';
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
import { FormattedNumber } from 'modules/types';
import { FormDropdown, TextInput } from 'modules/common/form';
import { CloseButton } from 'modules/common/buttons';
import { TRANSFER_ETH_GAS_COST } from 'modules/auth/actions/transfer-funds';
import { displayGasInDai, getGasInDai } from 'modules/app/actions/get-ethToDai-rate';

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
  ethInReserve: FormattedNumber;
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

  amountChangeFromSigner = (amount: string) => {
    const {
      balances,
      fallBackGasCosts,
      gasPrice,
    } = this.props;
    const { errors: updatedErrors, currency } = this.state;
    let newAmount = amount;
    const gas = fallBackGasCosts[currency.toLowerCase()];
    const gasInEth = formatGasCostToEther(gas, { decimals: 4}, createBigNumber(GWEI_CONVERSION).multipliedBy(gasPrice));
    const balance = balances.signerBalances[currency.toLowerCase()];
    const eth = balances.signerBalances.eth;
    const amountMinusGas = createBigNumber(eth).minus(createBigNumber(gasInEth))
    if (currency === ETH) {
      newAmount = amountMinusGas;
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
      ethInReserve,
    } = this.props;
    const { errors: updatedErrors, currency } = this.state;
    const { relayerGasCosts } = this.state;
    const newAmount = convertExponentialToDecimal(sanitizeArg(amount));
    const bnNewAmount = createBigNumber(newAmount || '0');

    if (useSigner) return this.amountChangeFromSigner(newAmount);

    updatedErrors.amount = '';
    const availableEth = createBigNumber(balances.eth);
    const availableDai = createBigNumber(balances.dai);
    const balance = balances[currency.toLowerCase()];

    const relayerGasCostsDAI = getGasInDai(relayerGasCosts.multipliedBy(gasPrice));
    const gasCostInEth = fallBackGasCosts[currency.toLowerCase()];

    let amountMinusGas = ZERO;

    if (GsnEnabled) {
      const gasCost = relayerGasCosts.multipliedBy(gasPrice);
      const relayerGasCostsDAI = getGasInDai(gasCost);
      if (currency === DAI) {
          amountMinusGas = availableDai
          .minus(bnNewAmount)
          .minus(createBigNumber(relayerGasCostsDAI.value));
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
    this.setErrorMessage(newAmount, updatedErrors, balance, amountMinusGas, GsnEnabled);
  };

  setErrorMessage = (newAmount, updatedErrors, balance, amountMinusGas, GsnEnabled) => {
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
      updatedErrors.amount = 'Not enough DAI available to pay gas cost.';
    }

    if (!GsnEnabled && amountMinusGas.lt(ZERO)) {
      updatedErrors.amount = `Not enough ETH to pay gas cost. ${amountMinusGas} is needed`;
    }

    this.setState({ amount: newAmount, errors: updatedErrors });
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

    const buttons = [
      {
        text: 'Send',
        action: () =>
          transferFunds(formattedAmount.fullPrecision, currency, address, useSigner),
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
        label: transactionLabel,
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
        <ButtonsRow buttons={buttons} />
      </div>
    );
  }
}
