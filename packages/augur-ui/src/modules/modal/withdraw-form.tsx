import React, { Component } from "react";

import { ImmediateImportance } from "modules/common/icons";
import { SquareDropdown } from "modules/common/selection";
import {
  Title,
  ButtonsRow,
  Breakdown,
  Description,
} from "modules/modal/common";
import { ETH, REP, ZERO } from "modules/common/constants";
import { formatEther, formatRep } from "utils/format-number";
import isAddress from "modules/auth/helpers/is-address";
import Styles from "modules/modal/modal.styles.less";
import { createBigNumber } from "utils/create-big-number";
import convertExponentialToDecimal from "utils/convert-exponential";
import { FormattedNumber } from "modules/types";
import { TextInput } from "modules/common/form";

interface WithdrawFormProps {
  closeAction: Function;
  transferFunds: Function;
  GasCosts: {
    eth: FormattedNumber;
    rep: FormattedNumber;
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
      amount: "",
    }
  };

  options = [
    {
      label: ETH,
      value: ETH,
    },
    {
      label: REP,
      value: REP,
    }
  ];

  dropdownChange = (value: string) => {
    const { amount } = this.state;
    this.setState({ currency: value });
    if (amount.length) {
      this.amountChange({ target: { value: amount } });
    }
  }

  handleMax = () => {
    const { loginAccount, GasCosts } = this.props;
    const { currency } = this.state;
    const fullAmount = createBigNumber(loginAccount[currency.toLowerCase()]);
    const valueMinusGas = fullAmount.minus(GasCosts.eth.fullPrecision);
    const resolvedValue = valueMinusGas.lt(ZERO) ? ZERO : valueMinusGas;
    this.amountChange({
      target: {
        value: currency === ETH ? resolvedValue.toFixed() : fullAmount.toFixed()
      },
    });
  }

  amountChange = (amouont: string) => {
    const { loginAccount, GasCosts } = this.props;
    const newAmount = convertExponentialToDecimal(sanitizeArg(parseFloat(amount)));
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

    // @ts-ignore
    if (isNaN(parseFloat(newAmount))) {
      updatedErrors.amount = `Quantity isn't a number.`;
    }
    // @ts-ignore
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
  // @ts-ignore
    this.setState({ amount: newAmount, errors: updatedErrors });
  }

  addressChange = (address: string) => {
    const { errors: updatedErrors } = this.state;
    updatedErrors.address = "";
    if (address && !isAddress(address)) {
      updatedErrors.address = `Address is invalid`;
    }

    if (address === "") {
      updatedErrors.address = `Address is required`;
    }
    this.setState({ address, errors: updatedErrors });
  }

  render() {
    const { GasCosts, transferFunds, loginAccount, closeAction } = this.props;
    const { amount, currency, address, errors } = this.state;
    const { amount: errAmount, address: errAddress } = errors;
    const isValid =
      errAmount === "" && errAddress === "" && amount.length && address.length;

    const formattedAmount =
      currency === ETH ? formatEther(Number(amount) || 0) : formatRep(amount || 0);
    const gasCost = GasCosts[currency.toLowerCase()];
    const formattedTotal =
      currency === ETH
        ? formatEther(
            // @ts-ignore
            createBigNumber(amount || 0).plus(GasCosts.eth.fullPrecision)
          )
        : formattedAmount;
    const buttons = [
      {
        text: "send",
        action: () =>
          transferFunds(formattedAmount.fullPrecision, currency, address),
        disabled: !isValid,
      },
      {
        text: "cancel",
        action: closeAction,
      },
    ];
    const breakdown = [
      {
        label: "Send",
        value: formattedAmount,
        useValueLabel: true,
        showDenomination: true,
      },
      {
        label: "GAS Cost",
        value: gasCost,
        useValueLabel: true,
        showDenomination: true,
      },
      {
        label: "Total",
        value: formattedTotal,
        useValueLabel: true,
        showDenomination: true,
        highlight: true,
      }
    ];

    return (
      <div className={Styles.WithdrawForm}>
        <Title title="Send Funds" closeAction={closeAction} />
        <main>
          {/*
            // @ts-ignore */}
          <Description
            description={["Send funds from your connected wallet"]}
          />
          <div className={Styles.GroupedForm}>
            <div>
              <label htmlFor="recipient">Recipient</label>
              <TextInput
                type="text"
                id="recipient"
                autoComplete="off"
                placeholder="0x..."
                onChange={this.addressChange}
                error={errors.address.length > 0}
                errorMessage={errors.address}
              />
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
              <TextInput
                type="number"
                id="amount"
                placeholder="0.00"
                onChange={this.amountChange}
                error={errors.amount && errors.amount.length > 0}
                errorMessage={errors.amount}
                value={amount}
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
