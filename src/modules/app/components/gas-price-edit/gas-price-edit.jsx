import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import toggleHeight from "utils/toggle-height/toggle-height";
import ConnectDropdown from "modules/auth/containers/connect-dropdown";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";
import formatAddress from "modules/auth/helpers/format-address";

import Styles from "modules/app/components/gas-price-edit/gas-price-edit.styles";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";

export default class GasPriceEdit extends Component {
  static propTypes = {
    isLogged: PropTypes.bool,
    address: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };
  }

  render() {
    const { isLogged, address } = this.props;
    const s = this.state;

    return (
      <div
        className={classNames(Styles.ConnectAccount, {
          [Styles.ConnectAccount__selected]: s.dropdownOpen
        })}
        ref={connectAccount => {
          this.connectAccount = connectAccount;
        }}
      >
        <div
          className={Styles.ConnectAccount__container}
          onClick={this.toggleDropdown}
          role="button"
          tabIndex="-1"
        >
          <div className={Styles.ConnectAccount__column}>
            <div className={Styles.ConnectAccount__status}>
              <div
                className={classNames(
                  Styles["ConnectAccount__status-indicator"],
                  {
                    [Styles.ConnectAccount__statusGreen]: isLogged
                  }
                )}
              />
              {isLogged ? "Connected" : "Disconnected"}
            </div>
            <div className={Styles.ConnectAccount__title}>
              {isLogged ? formatAddress(address || "") : "Connect A Wallet"}
            </div>
          </div>
          <div className={Styles.ConnectAccount__arrow}>
            <ChevronFlip
              pointDown={s.dropdownOpen}
              stroke="#fff"
              filledInIcon
              quick
            />
          </div>
        </div>
      </div>
    );
  }
}
