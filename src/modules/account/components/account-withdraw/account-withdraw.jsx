/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from "react";
import PropTypes from "prop-types";

import { createBigNumber, BigNumber } from "utils/create-big-number";
import Input from "modules/common/components/input/input";
import InputDropdown from "modules/common/components/input-dropdown/input-dropdown";
import { ZERO } from "modules/trades/constants/numbers";
import { ETH, REP } from "modules/account/constants/asset-types";
import {
  ExclamationCircle as InputErrorIcon,
  Withdraw
} from "modules/common/components/icons";
import {
  formatEther,
  formatRep,
  formatGasCostToEther,
  formatEtherEstimate
} from "utils/format-number";
import isAddress from "modules/auth/helpers/is-address";
import FormStyles from "modules/common/less/form";
import Styles from "modules/account/components/account-withdraw/account-withdraw.styles";

const TRANSFER_ETH_GAS_COST = 21000;
const TRANSFER_REP_GAS_COST = 80000;
export default class AccountWithdraw extends Component {
  static propTypes = {
    isMobileSmall: PropTypes.bool.isRequired,
    eth: PropTypes.object.isRequired,
    rep: PropTypes.object.isRequired,
    transferFunds: PropTypes.func.isRequired,
    withdrawReviewModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    gasPrice: PropTypes.number.isRequired
  };

  static validateAddress(address, callback) {
    const sanitizedAddress = sanitizeArg(address);
    const updatedErrors = {};

    if (address && !isAddress(sanitizedAddress)) {
      updatedErrors.address = `Address is invalid`;
    }

    if (address === "") {
      updatedErrors.address = `Address is required`;
    }

    callback(updatedErrors, sanitizedAddress);
  }

  constructor(props) {
    super(props);

    const etherGasCost = formatEtherEstimate(
      formatGasCostToEther(
        TRANSFER_ETH_GAS_COST,
        { decimalsRounded: 4 },
        props.gasPrice
      )
    );

    const repGasCost = formatEtherEstimate(
      formatGasCostToEther(
        TRANSFER_REP_GAS_COST,
        { decimalsRounded: 4 },
        props.gasPrice
      )
    );

    this.DEFAULT_STATE = {
      upperBound: props.eth.fullPrecision,
      selectedAsset: ETH,
      amount: "",
      address: "",
      isValid: null,
      etherGasCost,
      repGasCost
    };

    this.state = Object.assign(this.DEFAULT_STATE, { errors: {} });
    this.validateForm = this.validateForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.withdrawReview = this.withdrawReview.bind(this);
  }

  setMAXValue() {
    const { upperBound, etherGasCost, selectedAsset, address } = this.state;
    let amount = upperBound;
    const gasValue = etherGasCost.value;
    if (selectedAsset === ETH) {
      amount = createBigNumber(upperBound)
        .minus(gasValue)
        .toFixed();
      this.setState({
        amount
      });
    }
    // get gas fee and subtract from available balance
    this.validateForm(amount, address);
  }

  validateAmount(amount, callback) {
    const { eth } = this.props;
    const { selectedAsset, repGasCost, upperBound, etherGasCost } = this.state;
    let gasValue = etherGasCost.value;
    if (selectedAsset !== ETH) {
      gasValue = repGasCost.value;
    }
    const sanitizedAmount = sanitizeArg(amount);
    const BNsanitizedAmount = createBigNumber(sanitizedAmount || 0);
    const BNupperlimit = createBigNumber(upperBound);
    const ethAmountMinusGas = createBigNumber(eth.fullPrecision).minus(
      createBigNumber(gasValue)
    );
    const updatedErrors = {};

    if (amount === "") {
      updatedErrors.amount = `Quantity is required.`;
    }

    if (amount && isNaN(parseFloat(sanitizedAmount))) {
      updatedErrors.amount = `Quantity isn't a number.`;
    }

    if (amount && !isFinite(sanitizedAmount)) {
      updatedErrors.amount = `Quantity isn't finite.`;
    }

    if (amount && BNsanitizedAmount.gt(BNupperlimit)) {
      updatedErrors.amount = `Quantity is greater than available funds.`;
    }

    if (amount && BNsanitizedAmount.lte(ZERO)) {
      updatedErrors.amount = `Quantity must be greater than zero.`;
    }

    if (amount && ethAmountMinusGas.lt(ZERO)) {
      updatedErrors.amount = `Not enough ETH available to pay gas cost.`;
    }

    callback(updatedErrors, sanitizedAmount);
  }

  validateForm(amountValue, addressValue) {
    this.validateAmount(amountValue, (amountErrors, sanitizedAmount) => {
      AccountWithdraw.validateAddress(
        addressValue,
        (addressErrors, sanitizedAddress) => {
          const updatedErrors = Object.assign(amountErrors, addressErrors);
          this.setState({
            errors: updatedErrors,
            isValid: !amountErrors.amount && !addressErrors.address,
            address: sanitizedAddress,
            amount: sanitizedAmount
          });
        }
      );
    });
  }

  withdrawReview() {
    const { withdrawReviewModal, closeModal } = this.props;
    const s = this.state;
    if (s.isValid) {
      withdrawReviewModal({
        title: "Review Withdrawal",
        items: [
          {
            label: "Recipient",
            value: s.address,
            denomination: ""
          },
          {
            label: s.selectedAsset,
            value:
              s.selectedAsset === ETH
                ? formatEther(s.amount).fullPrecision
                : formatRep(s.amount).fullPrecision,
            denomination: s.selectedAsset
          },
          {
            label: "Gas Cost",
            value:
              s.selectedAsset === ETH
                ? s.etherGasCost.fullPrecision
                : s.repGasCost.fullPrecision,
            denomination: "ETH"
          }
        ],
        buttons: [
          {
            label: "cancel",
            action: closeModal,
            type: "gray"
          },
          {
            label: "submit",
            action: this.submitForm,
            type: "purple"
          }
        ]
      });
    }
  }

  submitForm() {
    const { transferFunds } = this.props;
    const s = this.state;

    if (s.isValid) {
      const stringedAmount = BigNumber.isBigNumber(s.amount)
        ? s.amount.toString()
        : s.amount;
      transferFunds(stringedAmount, s.selectedAsset, s.address);
      const { selectedAsset } = s;
      this.setState(this.DEFAULT_STATE, () => {
        this.setState({
          selectedAsset
        });
      });
    }
  }

  render() {
    const { eth, isMobileSmall, rep } = this.props;
    const s = this.state;

    return (
      <section className={Styles.AccountWithdraw}>
        <div className={Styles.AccountWithdraw__heading}>
          <h1>Account: Withdraw</h1>
          {Withdraw}
        </div>
        <div className={Styles.AccountWithdraw__main}>
          <div className={Styles.AccountWithdraw__description}>
            <p>
              Withdraw Ethereum or Reputation from your Trading Account into
              another account.
            </p>
            <p>
              Use Max button to transfer all ETH or REP. Gas fee will be
              subtracted from quantity input, if transferring ETH.
            </p>
          </div>

          <div className={Styles.AccountWithdraw__form}>
            <div className={Styles["AccountWithdraw__form-fields"]}>
              <div className={Styles["AccountWithdraw__input-wrapper"]}>
                <label htmlFor="currency">Select Currency</label>
                <InputDropdown
                  id="currency"
                  name="currency"
                  className={Styles.AccountWithdraw__dropdown}
                  label="Select Currency"
                  options={["ETH", "REP"]}
                  default="ETH"
                  type="text"
                  value={s.totalValue}
                  isMobileSmall={isMobileSmall}
                  onChange={type => {
                    const selectedAsset = type === "ETH" ? ETH : REP;
                    const upperBound =
                      type === "ETH" ? eth.fullPrecision : rep.fullPrecision;
                    this.setState({
                      selectedAsset,
                      upperBound,
                      amount: ""
                    });
                  }}
                />
              </div>
              <div className={Styles["AccountWithdraw__input-wrapper"]}>
                <label htmlFor="quantity">Quantity</label>
                <Input
                  id="quantity"
                  name="quantity"
                  label="Quantity"
                  type="number"
                  incrementAmount={1}
                  max={s.upperBound}
                  min={0.1}
                  value={s.amount}
                  updateValue={amount => this.validateForm(amount, s.address)}
                  onChange={amount => this.validateForm(amount, s.address)}
                  autoComplete="off"
                  maxButton={Boolean(true)}
                  onMaxButtonClick={() => this.setMAXValue()}
                  darkMaxBtn
                />
                {s.errors.hasOwnProperty("amount") &&
                  s.errors.amount.length && (
                    <span className={FormStyles["Form__error--even__space"]}>
                      {InputErrorIcon}
                      {s.errors.amount}
                    </span>
                  )}
              </div>
              <div className={Styles["AccountWithdraw__input-wrapper"]}>
                <label htmlFor="address">Recipient Account Address</label>
                <Input
                  id="address"
                  name="address"
                  label="Recipient Account Address"
                  type="text"
                  value={s.address}
                  updateValue={address => this.validateForm(s.amount, address)}
                  onChange={address => this.validateForm(s.amount, address)}
                />
                {s.errors.hasOwnProperty("address") &&
                  s.errors.address.length && (
                    <span className={FormStyles["Form__error--even__space"]}>
                      {InputErrorIcon}
                      {s.errors.address}
                    </span>
                  )}
              </div>
            </div>
            <button
              className={Styles.AccountWithdraw__submitButton}
              disabled={!s.isValid}
              onClick={this.withdrawReview}
              id="withdraw-button"
            >
              Withdraw
            </button>
          </div>
        </div>
      </section>
    );
  }
}

function sanitizeArg(arg) {
  return arg == null || arg === "" ? "" : arg;
}
