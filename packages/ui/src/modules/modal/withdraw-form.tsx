import React, { Component } from "react";

import { ImmediateImportance } from "modules/common-elements/icons";
import { FormattedValue } from "modules/common-elements/labels";
import { SquareDropdown } from "modules/common-elements/selection";
import {
  Title,
  ButtonsRow,
  Breakdown,
  Description
} from "modules/modal/common";
import { ETH, REP, ZERO } from "modules/common-elements/constants";
import { formatEther, formatRep } from "utils/format-number";
import isAddress from "modules/auth/helpers/is-address";
import Styles from "modules/modal/modal.styles";
import { createBigNumber } from "utils/create-big-number";
import convertExponentialToDecimal from "utils/convert-exponential";

interface WithdrawFormProps {
  closeAction: Function;
  transferFunds: Function;
  GasCosts: {
    eth: FormattedValue;
    rep: FormattedValue;
  };
  loginAccount: {
    rep: string;
    eth: string;
  };
}

interface WithdrawFormState {
  address: string;
  currency: string;
  amount: string;
  errors: {
    address: string;
    amount: string;
  };
}

function sanitizeArg(arg: any) {
  return arg == null || arg === "" ? "" : arg;
}

export class WithdrawForm extends Component<
  WithdrawFormProps,
  WithdrawFormState
> {
  state: WithdrawFormState = {
    address: "",
    currency: ETH,
    amount: "",
    errors: {
      address: "",
      amount: ""
    }
  };

  options = [
    {
      label: ETH,
      value: ETH
    },
    {
      label: REP,
      value: REP
    }
  ];

  dropdownChange = (value: string) => {
    const { amount } = this.state;
    this.setState({ currency: value });
    if (amount.length) {
      this.amountChange({ target: { value: amount } });
    }
  };

  handleMax = () => {
    const { loginAccount, GasCosts } = this.props;
    const { currency } = this.state;
    const fullAmount = createBigNumber(loginAccount[currency.toLowerCase()]);
    const valueMinusGas = fullAmount.minus(GasCosts.eth.fullPrecision);
    const resolvedValue = valueMinusGas.lt(ZERO) ? ZERO : valueMinusGas;
    this.amountChange({
      target: {
        value: currency === ETH ? resolvedValue.toFixed() : fullAmount.toFixed()
      }
    });
  };

  amountChange = (e: Event) => {
    const { loginAccount, GasCosts } = this.props;
    const newAmount = convertExponentialToDecimal(sanitizeArg(e.target.value));
    const bnNewAmount = createBigNumber(newAmount || "0");
    const { errors: updatedErrors, currency } = this.state;
    updatedErrors.amount = "";
    const availableEth = createBigNumber(loginAccount.eth);
    let amountMinusGas = createBigNumber(0);
    if (currency === ETH && newAmount) {
      amountMinusGas = availableEth
        .minus(bnNewAmount)
        .minus(GasCosts.eth.fullPrecision);
    } else {
      amountMinusGas = availableEth.minus(GasCosts.rep.fullPrecision);
    }
    // validation...
    if (newAmount === "" || newAmount === undefined) {
      updatedErrors.amount = `Quantity is required.`;
      return this.setState({ amount: newAmount, errors: updatedErrors });
    }

    if (isNaN(parseFloat(newAmount))) {
      updatedErrors.amount = `Quantity isn't a number.`;
    }

    if (!isFinite(newAmount)) {
      updatedErrors.amount = `Quantity isn't finite.`;
    }

    if (bnNewAmount.gt(loginAccount[currency.toLowerCase()])) {
      updatedErrors.amount = `Quantity is greater than available funds.`;
    }

    if (bnNewAmount.lte(ZERO)) {
      updatedErrors.amount = `Quantity must be greater than zero.`;
    }

    if (amountMinusGas.lt(ZERO)) {
      updatedErrors.amount = `Not enough ETH available to pay gas cost.`;
    }

    this.setState({ amount: newAmount, errors: updatedErrors });
  };

  addressChange = (e: Event) => {
    const address = e.target.value;
    const { errors: updatedErrors } = this.state;
    updatedErrors.address = "";
    if (address && !isAddress(address)) {
      updatedErrors.address = `Address is invalid`;
    }

    if (address === "") {
      updatedErrors.address = `Address is required`;
    }
    this.setState({ address, errors: updatedErrors });
  };

  render() {
    const { GasCosts, transferFunds, loginAccount, closeAction } = this.props;
    const { amount, currency, address, errors } = this.state;
    const { amount: errAmount, address: errAddress } = errors;
    const isValid =
      errAmount === "" && errAddress === "" && amount.length && address.length;

    const formattedAmount =
      currency === ETH ? formatEther(amount || 0) : formatRep(amount || 0);
    const gasCost = GasCosts[currency.toLowerCase()];
    const formattedTotal =
      currency === ETH
        ? formatEther(
            createBigNumber(amount || 0).plus(GasCosts.eth.fullPrecision)
          )
        : formattedAmount;
    const buttons = [
      {
        text: "send",
        action: () =>
          transferFunds(formattedAmount.fullPrecision, currency, address),
        disabled: !isValid
      },
      {
        text: "cancel",
        action: closeAction
      }
    ];
    const breakdown = [
      {
        label: "Send",
        value: formattedAmount,
        useValueLabel: true,
        showDenomination: true
      },
      {
        label: "GAS Cost",
        value: gasCost,
        useValueLabel: true,
        showDenomination: true
      },
      {
        label: "Total",
        value: formattedTotal,
        useValueLabel: true,
        showDenomination: true,
        highlight: true
      }
    ];
    return (
      <div className={Styles.WithdrawForm}>
        <Title title="Send Funds" closeAction={closeAction} />
        <main>
          <Description
            description={["Send funds from your connected wallet"]}
          />
          <div className={Styles.GroupedForm}>
            <div>
              <label htmlFor="recipient">Recipient</label>
              <input
                type="text"
                id="recipient"
                autoComplete="off"
                value={address}
                placeholder="0x..."
                onChange={this.addressChange}
              />
              {errors.address.length && (
                <span>
                  {ImmediateImportance} {errors.address}
                </span>
              )}
            </div>
            <div>
              <label htmlFor="currency">Currency</label>
              <SquareDropdown
                id="currency"
                options={this.options}
                defaultValue={currency}
                onChange={this.dropdownChange}
                stretchOut
              />
              <span>Available: {loginAccount[currency.toLowerCase()]}</span>
            </div>
            <div>
              <label htmlFor="amount">Amount</label>
              <button onClick={this.handleMax}>MAX</button>
              <input
                type="number"
                id="amount"
                placeholder="0.00"
                value={amount}
                onChange={this.amountChange}
              />
              {errors.amount &&
                errors.amount.length && (
                  <span>
                    {ImmediateImportance} {errors.amount}
                  </span>
                )}
            </div>
          </div>
          <Breakdown rows={breakdown} />
        </main>
        <ButtonsRow buttons={buttons} />
      </div>
    );
  }
}
