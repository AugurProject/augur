import React, { Component } from 'react';

import { ButtonsRow, Breakdown } from 'modules/modal/common';
import { DAI, ETH, REP, ZERO } from 'modules/common/constants';
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
import { FormattedNumber, LoginAccount } from 'modules/types';
import { FormDropdown, TextInput } from 'modules/common/form';
import { CloseButton } from 'modules/common/buttons';
import { TRANSFER_ETH_GAS_COST } from 'modules/auth/actions/transfer-funds';
import { ethToDai, displayGasInDai } from 'modules/app/actions/get-ethToDai-rate';

interface WithdrawFormProps {
  closeAction: Function;
  transferFunds: Function;
  transferFundsGasEstimate: Function;
  fallBackGasCosts: {
    eth: FormattedNumber;
    rep: FormattedNumber;
    dai: FormattedNumber;
  };
  loginAccount: LoginAccount;
  Gnosis_ENABLED: boolean;
  ethToDaiRate: BigNumber;
  gasPrice: number;
}

interface WithdrawFormState {
  address: string;
  currency: string;
  amount: string;
  errors: {
    address: string;
    amount: string;
  };
  relayerGasCosts: BigNumber;
}

function sanitizeArg(arg) {
  return arg == null || arg === '' ? '' : arg;
}

export class WithdrawForm extends Component<
  WithdrawFormProps,
  WithdrawFormState
> {
  state: WithdrawFormState = {
    relayerGasCosts: createBigNumber(TRANSFER_ETH_GAS_COST),
    address: '',
    currency: ETH,
    amount: '',
    errors: {
      address: '',
      amount: '',
    },
  };

  options = [
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

  dropdownChange = (value: string) => {
    const { amount } = this.state;
    this.setState({ currency: value });
    if (amount.length) {
      this.amountChange(amount);
    }
  };

  handleMax = () => {
    const { loginAccount, fallBackGasCosts, Gnosis_ENABLED, gasPrice } = this.props;
    const { currency, relayerGasCosts } = this.state;
  
    const gasEstimate = Gnosis_ENABLED
    ? formatGasCostToEther(
        relayerGasCosts,
        { decimalsRounded: 4 },
        gasPrice,
      )
    : fallBackGasCosts[currency.toLowerCase()];

    const fullAmount = createBigNumber(
      loginAccount.balances[currency.toLowerCase()]
    );
    const valueMinusGas = fullAmount.minus(createBigNumber(gasEstimate.fullPrecision));
    const resolvedValue = valueMinusGas.lt(ZERO) ? ZERO : valueMinusGas;
    this.amountChange(resolvedValue.toFixed());
  };

  amountChange = (amount: string) => {
    const {
      loginAccount,
      fallBackGasCosts,
      Gnosis_ENABLED,
      ethToDaiRate,
      gasPrice,
    } = this.props;
    const { relayerGasCosts } = this.state;
    const newAmount = convertExponentialToDecimal(sanitizeArg(amount));
    const bnNewAmount = createBigNumber(newAmount || '0');
    const { errors: updatedErrors, currency } = this.state;
    updatedErrors.amount = '';
    const availableEth = createBigNumber(loginAccount.balances.eth);
    const availableDai = createBigNumber(loginAccount.balances.dai);
    let amountMinusGas = ZERO;

    if (Gnosis_ENABLED) {
      const relayerGasCostsETH = formatGasCostToEther(
        relayerGasCosts,
        { decimalsRounded: 4 },
        gasPrice
      );
      const relayerGasCostsDAI = ethToDai(relayerGasCostsETH, ethToDaiRate);

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
        createBigNumber(loginAccount.balances[currency.toLowerCase()])
      )
    ) {
      updatedErrors.amount = 'Quantity is greater than available funds.';
    }

    if (bnNewAmount.lte(ZERO)) {
      updatedErrors.amount = 'Quantity must be greater than zero.';
    }

    if (Gnosis_ENABLED && amountMinusGas.lt(ZERO)) {
      updatedErrors.amount = 'Not enough DAI available to pay gas cost.';
    }

    if (!Gnosis_ENABLED && amountMinusGas.lt(ZERO)) {
      updatedErrors.amount = 'Not enough ETH available to pay gas cost.';
    }

    this.setState({ amount: newAmount, errors: updatedErrors });
  };

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
          : this.props.loginAccount.address
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
      fallBackGasCosts,
      transferFunds,
      loginAccount,
      closeAction,
      Gnosis_ENABLED,
      ethToDaiRate,
      gasPrice,
    } = this.props;
    const { relayerGasCosts, amount, currency, address, errors } = this.state;
    const { amount: errAmount, address: errAddress } = errors;
    const isValid =
      errAmount === '' && errAddress === '' && amount.length && address.length;

    let formattedAmount = formatEther(amount || 0);

    if (currency === DAI) {
      formattedAmount = formatDai(amount || 0);
    } else if (currency === REP) {
      formattedAmount = formatRep(amount || 0);
    }

    const gasEstimate = Gnosis_ENABLED
      ? formatGasCostToEther(
          relayerGasCosts,
          { decimalsRounded: 4 },
          gasPrice,
        )
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
        value: Gnosis_ENABLED
          ? displayGasInDai(gasEstimate, ethToDaiRate)
          : gasEstimate,
      },
    ];

    return (
      <div className={Styles.WithdrawForm}>
        <header>
          <div>
            <CloseButton action={() => closeAction()} />
          </div>
          <div>
            <h1>Withdraw funds</h1>
            <h2>Withdraw funds to another address</h2>
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
                onChange={this.addressChange}
                errorMessage={errors.address.length > 0 ? errors.address : ''}
              />
            </div>
            <div>
              <div>
                <label htmlFor='currency'>Currency</label>
                <span>
                  Available: {loginAccount.balances[currency.toLowerCase()]}
                </span>
              </div>
              <FormDropdown
                id='currency'
                options={this.options}
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
