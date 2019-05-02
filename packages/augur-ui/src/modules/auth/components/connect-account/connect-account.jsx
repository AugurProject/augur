import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import ConnectDropdown from "modules/auth/containers/connect-dropdown";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";
import formatAddress from "modules/auth/helpers/format-address";

import Styles from "modules/auth/components/connect-account/connect-account.styles";
import ToggleHeightStyles from "utils/toggle-height.styles";

export default class ConnectAccount extends Component {
  static propTypes = {
    isLogged: PropTypes.bool.isRequired,
    isConnectionTrayOpen: PropTypes.bool.isRequired,
    address: PropTypes.string,
    className: PropTypes.string,
    updateConnectionTray: PropTypes.func.isRequired
  };

  static defaultProps = {
    address: "",
    className: undefined
  };

  constructor(props) {
    super(props);

    this.toggleDropdown = this.toggleDropdown.bind(this);
  }

  componentDidMount() {
    window.addEventListener("click", this.handleWindowOnClick);
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowOnClick);
  }

  toggleDropdown(cb) {
    const { updateConnectionTray, isConnectionTrayOpen } = this.props;
    updateConnectionTray(!isConnectionTrayOpen);
    if (cb && typeof cb === "function") cb();
  }

  render() {
    const { isLogged, address, className, isConnectionTrayOpen } = this.props;

    return (
      <div
        className={classNames(Styles.ConnectAccount, className, {
          [Styles.selected]: isConnectionTrayOpen,
          [Styles.ConnectAccountLoggedIn]: isLogged
        })}
        ref={connectAccount => {
          this.connectAccount = connectAccount;
        }}
      >
        <div
          className={classNames(Styles.container, {
            [Styles.containerLoggedIn]: isLogged
          })}
          onClick={this.toggleDropdown}
          role="button"
          tabIndex="-1"
        >
          <div className={Styles.column}>
            <div className={Styles.status}>
              <div
                className={classNames(Styles.statusIndicator, {
                  [Styles.statusGreen]: isLogged
                })}
              />
              {isLogged ? "Connected" : "Disconnected"}
            </div>
            <div className={Styles.title}>
              {isLogged ? formatAddress(address) : "Connect A Wallet"}
              <span
                className={classNames(Styles.arrow, {
                  [Styles.arrowHide]: isLogged
                })}
              >
                <ChevronFlip
                  pointDown={isConnectionTrayOpen}
                  stroke="#fff"
                  filledInIcon
                  quick
                />
              </span>
            </div>
          </div>
        </div>
        <div
          ref={ConnectDropdown => {
            this.ConnectDropdown = ConnectDropdown;
          }}
          className={classNames(
            Styles.connectDropdown,
            ToggleHeightStyles.target,
            ToggleHeightStyles.quick,
            {
              [ToggleHeightStyles.open]: isConnectionTrayOpen
            }
          )}
        >
          <ConnectDropdown toggleDropdown={this.toggleDropdown} />
        </div>
      </div>
    );
  }
}
