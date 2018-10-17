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
    safeLow: PropTypes.number,
    average: PropTypes.number,
    fast: PropTypes.number,
    userDefinedGasPrice: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      amount: props.userDefinedGasPrice || props.average,
      showLowAlert: (props.userDefinedGasPrice || props.average) < props.safeLow
    };
  }

  updateAmount(amount) {
    let amt = "";
    if (amount) amt = parseFloat(amount, 10);
    this.setState({ amount: amt, showLowAlert: amt < this.props.safeLow });
  }

  render() {
    const p = this.props;
    const s = this.state;

    const disableButton = !s.amount || s.amount < 0;

    const buttons = [
      {
        label: "cancel",
        action: p.closeModal,
        type: "gray"
      },
      {
        label: "Save",
        action: () => p.saveModal(s.amount),
        type: "purple",
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
        columnLabels: ["Slow (<30m)", p.safeLow],
        rowAction: () => this.updateAmount(p.safeLow),
        rowNumber: 1
      },
      {
        columnLabels: ["Standard (<5m)", p.average],
        rowAction: () => this.updateAmount(p.average),
        rowNumber: 2
      },
      {
        columnLabels: ["Fast (<2m)", p.fast],
        rowAction: () => this.updateAmount(p.fast),
        rowNumber: 3
      }
    ];

    return (
      <section className={Styles.TightModalContainer}>
        <h1>Gas Price (gwei)</h1>
        {s.showLowAlert &&
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
          value={s.amount}
          onChange={amount => this.updateAmount(amount)}
          updateValue={amount => this.updateAmount(amount)}
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
