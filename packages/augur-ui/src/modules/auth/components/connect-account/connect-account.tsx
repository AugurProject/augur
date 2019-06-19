import React, { Component } from "react";
import classNames from "classnames";

import ConnectDropdown from "modules/auth/containers/connect-dropdown";
import ChevronFlip from "modules/common/chevron-flip";
import formatAddress from "modules/auth/helpers/format-address";

import Styles from "modules/auth/components/connect-account/connect-account.styles.less";
import ToggleHeightStyles from "utils/toggle-height.styles.less";

interface ConnectAccountProps {
  isLogged: boolean;
  isConnectionTrayOpen: boolean;
  address?: string;
  className?: string;
  updateConnectionTray: Function;
}

export default class ConnectAccount extends Component<ConnectAccountProps> {
  static defaultProps = {
    address: "",
    className: undefined,
  };

  public connectAccount;
  public connectDropdown;

  constructor(props) {
    super(props);

    this.toggleDropdown = this.toggleDropdown.bind(this);
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
          [Styles.ConnectAccountLoggedIn]: isLogged,
        })}
        ref={(connectAccount) => {
          this.connectAccount = connectAccount;
        }}
      >
        <div
          className={classNames(Styles.container, {
            [Styles.containerLoggedIn]: isLogged,
          })}
          onClick={this.toggleDropdown}
          role="button"
          tabIndex={-1}
        >
          <div>
            <div className={Styles.status}>
              <div
                className={classNames(Styles.statusIndicator, {
                  [Styles.statusGreen]: isLogged,
                })}
              />
              {isLogged ? "Connected" : "Disconnected"}
            </div>
            <div className={Styles.title}>
              {isLogged ? formatAddress(address) : "Connect A Wallet"}
              <span
                className={classNames(Styles.arrow, {
                  [Styles.arrowHide]: isLogged,
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
          ref={(connectDropdown) => {
            this.connectDropdown = connectDropdown;
          }}
          className={classNames(
            Styles.connectDropdown,
            ToggleHeightStyles.target,
            ToggleHeightStyles.quick,
            {
              [ToggleHeightStyles.open]: isConnectionTrayOpen,
            }
          )}
        >
          <ConnectDropdown toggleDropdown={this.toggleDropdown} />
        </div>
      </div>
    );
  }
}
