import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import toggleHeight from "utils/toggle-height/toggle-height";
import ConnectDropdown from "modules/auth/containers/connect-dropdown";
import ChevronFlip from "modules/common/components/chevron-flip/chevron-flip";
import formatAddress from "modules/auth/helpers/format-address";

import Styles from "modules/auth/components/connect-account/connect-account.styles";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";

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

  componentWillUpdate(nextProps) {
    const { isLogged, isConnectionTrayOpen } = this.props;
    if (nextProps.isConnectionTrayOpen !== isConnectionTrayOpen) {
      toggleHeight(this.ConnectDropdown, isConnectionTrayOpen);
    } else if (
      nextProps.isLogged !== isLogged &&
      nextProps.isLogged &&
      isConnectionTrayOpen
    ) {
      toggleHeight(this.ConnectDropdown, false);
    }
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
          [Styles.ConnectAccount__selected]: isConnectionTrayOpen,
          [Styles.ConnectAccountLoggedIn]: isLogged
        })}
        ref={connectAccount => {
          this.connectAccount = connectAccount;
        }}
      >
        <div
          className={classNames(Styles.ConnectAccount__container, {
            [Styles.ConnectAccount__containerLoggedIn]: isLogged
          })}
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
              {isLogged ? formatAddress(address) : "Connect A Wallet"}
              <span
                className={classNames(Styles.ConnectAccount__arrow, {
                  [Styles.ConnectAccount__arrowHide]: isLogged
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
            Styles.ConnectAccount__connectDropdown,
            ToggleHeightStyles["toggle-height-target"],
            ToggleHeightStyles["toggle-height-target-quick"]
          )}
        >
          <ConnectDropdown toggleDropdown={this.toggleDropdown} />
        </div>
      </div>
    );
  }
}
