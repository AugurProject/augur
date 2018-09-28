import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import toggleHeight from "utils/toggle-height/toggle-height";
import ConnectDropdown from "modules/auth/containers/connect-dropdown";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";
import formatAddress from "modules/auth/helpers/format-address";
import { MODAL_GAS_PRICE } from "modules/modal/constants/modal-types";

import Styles from "modules/app/components/gas-price-edit/gas-price-edit.styles";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";

export default class GasPriceEdit extends Component {
  static propTypes = {
    updateModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };

    this.showModal = this.showModal.bind(this);
  }

  showModal() {
    this.props.updateModal({
      type: MODAL_GAS_PRICE,
    })
  }

  render() {
    const { isLogged, address } = this.props;
    const s = this.state;

    return (
      <div className={classNames(Styles.GasPriceEdit)}>
        <div
          className={Styles.GasPriceEdit__container}
          onClick={this.showModal}
          role="button"
          tabIndex="-1"
        >
          <div className={Styles.GasPriceEdit__title}>GAS PRICE (GWEI)</div>
          <div className={Styles.GasPriceEdit__info}>
            <div className={Styles.GasPriceEdit__price}> 23 </div>
            <div className={Styles.GasPriceEdit__description}> (FAST) </div>
            <div className={Styles.GasPriceEdit__edit}> Edit </div>
          </div>
        </div>
      </div>
    );
  }
}
