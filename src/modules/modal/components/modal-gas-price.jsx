import React, { Component } from "react";
import PropTypes from "prop-types";

import Input from "modules/common/components/input/input";
import ModalTable from "modules/modal/components/common/modal-table";
import ModalActions from "modules/modal/components/common/modal-actions";
import { yellowAlertIcon } from "modules/common/components/icons";

import Styles from "modules/modal/components/common/common.styles";

export default class ModalGasPrice extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    saveModal: PropTypes.func.isRequired,
    safeLow: PropTypes.number.isRequired,
    average: PropTypes.number.isRequired,
    fast: PropTypes.number.isRequired,
    userDefinedGasPrice: PropTypes.number
  };

  static defaultProps = {
    userDefinedGasPrice: null
  };

  constructor(props) {
    super(props);

    const { userDefinedGasPrice, average, safeLow } = props;

    this.state = {
      amount: userDefinedGasPrice || average,
      showLowAlert: (userDefinedGasPrice || average) < safeLow
    };
  }

  updateAmount(amount) {
    let amt = "";
    if (amount) amt = parseFloat(amount, 10);
    this.setState({ amount: amt, showLowAlert: amt < this.props.safeLow });
  }

  render() {
    const { closeModal, saveModal, safeLow, average, fast } = this.props;
    const { amount, showLowAlert } = this.state;

    const disableButton = !amount || amount < 0;

    const buttons = [
      {
        label: "cancel",
        action: closeModal,
        type: "gray"
      },
      {
        label: "Save",
        action: () => saveModal(amount),
        isDisabled: disableButton
      }
    ];

    const rows = [
      {
        columnLabels: ["Speed", "Gas Price (gwei)"],
        isHeading: true,
        rowNumber: 0
      },
      {
        columnLabels: ["Slow (<30m)", safeLow],
        rowAction: () => this.updateAmount(safeLow),
        rowNumber: 1
      },
      {
        columnLabels: ["Standard (<5m)", average],
        rowAction: () => this.updateAmount(average),
        rowNumber: 2
      },
      {
        columnLabels: ["Fast (<2m)", fast],
        rowAction: () => this.updateAmount(fast),
        rowNumber: 3
      }
    ];

    return (
      <section className={Styles.TightModalContainer}>
        <h1>Gas Price (gwei)</h1>
        {showLowAlert &&
          !disableButton && (
            <p className={Styles.Warning}>
              {yellowAlertIcon} Transactions are unlikely to be processed at
              your current gas price.
            </p>
          )}
        <Input
          id="price"
          name="price"
          label="price"
          type="number"
          isIncrementable
          incrementAmount={1}
          value={amount}
          onChange={value => this.updateAmount(value)}
          updateValue={value => this.updateAmount(value)}
          lightBorder
        />
        <h2>Recommended Gas Price</h2>
        <h3>(based on current network conditions)</h3>
        <ModalTable rows={rows} />
        <ModalActions buttons={buttons} />
      </section>
    );
  }
}
