/* eslint jsx-a11y/label-has-for: 0 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { createBigNumber } from "utils/create-big-number";
import FormStyles from "modules/common/less/form";
import { ExclamationCircle as InputErrorIcon } from "modules/common/components/icons";
import Styles from "modules/modal/components/modal-participate/modal-participate.styles";
import Input from "modules/common/components/input/input";
import ModalActions from "modules/modal/components/common/modal-actions";
import ModalReview from "modules/modal/components/modal-review/modal-review";
import commonStyles from "modules/modal/components/common/common.styles";
import { formatRep, formatEther } from "utils/format-number";

export default class ModalParticipate extends Component {
  static propTypes = {
    modal: PropTypes.object.isRequired,
    rep: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    purchaseParticipationTokens: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      quantity: "",
      gasEstimate: "0.0023",
      page: 1,
      isValid: false,
      errors: []
    };

    this.triggerReview = this.triggerReview.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleMaxClick = this.handleMaxClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.switchPages = this.switchPages.bind(this);
  }

  triggerReview(e, ...args) {
    const { purchaseParticipationTokens } = this.props;
    // e.preventDefault();
    if (this.state.isValid) {
      purchaseParticipationTokens(
        this.state.quantity,
        true,
        (err, gasEstimate) => {
          console.log("trigger review", err, gasEstimate);
          if (!err && !!gasEstimate) this.setState({ gasEstimate, page: 2 });
        }
      );
    }
  }

  submitForm(e, ...args) {
    const { purchaseParticipationTokens } = this.props;
    // e.preventDefault();
    purchaseParticipationTokens(this.state.quantity, false, (err, res) => {
      console.log("onSuccess for purchaseParticipationTokens", err, res);
    });
  }

  updateQuantity(quantity) {
    const { errors, isValid } = this.validateForm(quantity);
    this.setState({ isValid, errors, quantity });
  }

  validateForm(quantity) {
    const { rep } = this.props;
    const bnRep = createBigNumber(rep, 10);
    const errors = [];
    let isValid = true;

    if (quantity === "") {
      isValid = false;
      // exit early, as the other check doesn't matter.
      return { errors, isValid };
    }
    const bnQuantity = createBigNumber(quantity, 10);

    if (bnQuantity.lte(0)) {
      errors.push("Quantity must greater than 0.");
      isValid = false;
      // exit early, as the other check doesn't matter.
      return { errors, isValid };
    }

    if (bnQuantity.gt(bnRep)) {
      errors.push("Insufficient Funds.");
      isValid = false;
    }

    return { errors, isValid };
  }

  switchPages() {
    const nextPage = this.state.page === 1 ? 2 : 1;
    this.setState({ page: nextPage });
  }

  handleMaxClick() {
    const { rep } = this.props;
    this.setState({ quantity: rep, isValid: true, errors: [] });
  }

  handleKeyDown(e) {
    // if enter is pressed, lets handle this so we don't close modal
    if (e.keyCode === 13) {
      e.preventDefault();
      if (this.state.isValid) this.triggerReview(e);
    }
  }

  render() {
    const { closeModal } = this.props;
    const s = this.state;
    const invalidWithErrors = !s.isValid && s.errors.length > 0;
    const formattedQuantity = formatRep(s.quantity || 0);
    const formattedGas = formatEther(s.gasEstimate);
    const items = [
      {
        label: "Purchase",
        value: "Participation Tokens",
        denomination: ""
      },
      {
        label: "quantity",
        value: formattedQuantity.fullPrecision,
        denomination: ""
      },
      {
        label: "price",
        value: formattedQuantity.fullPrecision,
        denomination: "REP"
      },
      {
        label: "gas",
        value: formattedGas.fullPrecision,
        denomination: "ETH"
      }
    ];
    const buttons = [
      {
        label: "Back",
        action: this.switchPages,
        type: "gray"
      },
      {
        label: "submit",
        action: this.submitForm,
        type: "purple"
      }
    ];

    return (
      <section className={commonStyles.ModalContainer}>
        {s.page === 1 && (
          <form>
            <h1>Buy Participation Tokens</h1>
            <label htmlFor="modal__participate-quantity">
              Quantity (1 token @ 1 REP)
            </label>
            <Input
              id="modal__participate-quantity"
              type="number"
              className={classNames(FormStyles.Form__input, {
                [`${
                  Styles["ModalParticipate__error--field"]
                }`]: invalidWithErrors
              })}
              value={s.quantity}
              placeholder="0.0"
              onChange={value => this.updateQuantity(value)}
              onKeyDown={e => this.handleKeyDown(e)}
              autoComplete="off"
              maxButton
              onMaxButtonClick={() => this.handleMaxClick()}
            />
            {!!s.errors.length &&
              s.errors.map((error, index) => (
                <span key={error} className={commonStyles.Error}>
                  {InputErrorIcon} {error}
                </span>
              ))}
            <ModalActions
              buttons={[
                {
                  label: "cancel",
                  action: closeModal,
                  type: "gray"
                },
                {
                  label: "review",
                  action: this.triggerReview,
                  type: "purple",
                  isDisabled: !s.isValid
                }
              ]}
            />
          </form>
        )}
        {s.page === 2 && (
          <ModalReview
            title="Buy Participation Tokens"
            items={items}
            buttons={buttons}
          />
        )}
      </section>
    );
  }
}
