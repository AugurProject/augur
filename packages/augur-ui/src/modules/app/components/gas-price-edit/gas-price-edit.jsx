import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { MODAL_GAS_PRICE } from "modules/modal/constants/modal-types";

import Styles from "modules/app/components/gas-price-edit/gas-price-edit.styles";

const STANDARD = "Standard";
export default class GasPriceEdit extends Component {
  static propTypes = {
    updateModal: PropTypes.func.isRequired,
    userDefinedGasPrice: PropTypes.number.isRequired,
    gasPriceSpeed: PropTypes.string.isRequired,
    className: PropTypes.string
  };

  static defaultProps = {
    className: undefined
  };

  constructor(props) {
    super(props);

    this.showModal = this.showModal.bind(this);
  }

  showModal() {
    this.props.updateModal({
      type: MODAL_GAS_PRICE
    });
  }

  render() {
    const { userDefinedGasPrice, gasPriceSpeed, className } = this.props;

    return (
      <div className={classNames(Styles.GasPriceEdit, className)}>
        <div
          className={Styles.GasPriceEdit__container}
          onClick={this.showModal}
          role="button"
          tabIndex="-1"
        >
          <div className={Styles.GasPriceEdit__title}>
            Gas Price <span className={Styles.GasPriceEdit__unit}>(GWEI)</span>
          </div>
          <div className={Styles.GasPriceEdit__info}>
            <div className={Styles.GasPriceEdit__price}>
              {userDefinedGasPrice}
            </div>
            <div
              className={classNames({
                [Styles.GasPriceEdit__description_non_standard]:
                  gasPriceSpeed !== STANDARD,
                [Styles.GasPriceEdit__description_standard]:
                  gasPriceSpeed === STANDARD
              })}
            >
              ({gasPriceSpeed})
            </div>
            <div className={Styles.GasPriceEdit__edit}> Edit </div>
          </div>
        </div>
      </div>
    );
  }
}
