import React, { Component } from "react";
import PropTypes from "prop-types";

import Input from "modules/common/components/input/input";

import Styles from "modules/modal/components/modal-gas-price/modal-gas-price.styles";

export default class ModalGasPrice extends Component {
  static propTypes = {
    closeModal: PropTypes.func.isRequired,
    saveModal: PropTypes.func.isRequired,
    safeLow: PropTypes.number.isRequired,
    average: PropTypes.number.isRequired,
    fast: PropTypes.number.isRequired,
    userDefinedGasPrice: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      amount: props.userDefinedGasPrice || props.average
    };
  }

  updateAmount(amount) {
    let amt = "";
    if (amount) amt = parseFloat(amount, 10);
    this.setState({ amount: amt });
  }

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <section className={Styles.ModalGasPrice}>
        <h1>Gas Price (gwei)</h1>
        <div className={Styles.ModalGasPrice__input}>
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
        </div>
        <div className={Styles.ModalGasPrice__ActionButtons}>
          <button
            className={Styles.ModalGasPrice__cancel}
            onClick={p.closeModal}
          >
            Cancel
          </button>
          <button
            className={Styles.ModalGasPrice__save}
            disabled={!s.amount || s.amount < 0}
            onClick={() => p.saveModal(s.amount)}
          >
            Save
          </button>
        </div>
        <div className={Styles.ModalGasPrice__explanationTitle}>
          Recommended Gas Prices
        </div>
        <div className={Styles.ModalGasPrice__explanationSubheader}>
          (based on current network conditions)
        </div>
        <div className={Styles.ModalGasPrice__table}>
          <div className={Styles.ModalGasPrice__row}>
            <div className={Styles.ModalGasPrice__col}>Speed</div>
            <div className={Styles.ModalGasPrice__col}>Gas Price (gwei)</div>
          </div>
          <div
            role="button"
            className={Styles.ModalGasPrice__row}
            onClick={() => {
              this.updateAmount(p.safeLow);
            }}
            tabIndex={0}
          >
            <div className={Styles.ModalGasPrice__col}>{"Slow (<30m)"}</div>
            <div className={Styles.ModalGasPrice__col}>{p.safeLow}</div>
          </div>
          <div
            role="button"
            className={Styles.ModalGasPrice__row}
            onClick={() => this.updateAmount(p.average)}
            tabIndex={-1}
          >
            <div className={Styles.ModalGasPrice__col}>{"Standard (<5m)"}</div>
            <div className={Styles.ModalGasPrice__col}>{p.average}</div>
          </div>
          <div
            className={Styles.ModalGasPrice__row}
            role="button"
            onClick={() => this.updateAmount(p.fast)}
            tabIndex={-2}
          >
            <div className={Styles.ModalGasPrice__col}>{"Fast (<2m)"}</div>
            <div className={Styles.ModalGasPrice__col}>{p.fast}</div>
          </div>
        </div>
      </section>
    );
  }
}
