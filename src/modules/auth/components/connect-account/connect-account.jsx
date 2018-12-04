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
    address: PropTypes.string,
    className: PropTypes.string
  };

  static defaultProps = {
    address: "",
    className: undefined
  };

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.handleWindowOnClick = this.handleWindowOnClick.bind(this);
    this.setDropdownOpen = this.setDropdownOpen.bind(this);
  }

  componentDidMount() {
    window.addEventListener("click", this.handleWindowOnClick);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.isLogged !== this.props.isLogged && nextProps.isLogged) {
      this.setDropdownOpen(false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("click", this.handleWindowOnClick);
  }

  setDropdownOpen(value) {
    this.setState({ dropdownOpen: value }, () => {
      toggleHeight(this.ConnectDropdown, true, () => {});
    });
  }

  toggleDropdown(cb) {
    toggleHeight(this.ConnectDropdown, this.state.dropdownOpen, () => {
      this.setState({ dropdownOpen: !this.state.dropdownOpen });

      if (cb && typeof cb === "function") cb();
    });
  }

  handleWindowOnClick(event) {
    if (
      this.state.dropdownOpen &&
      this.connectAccount &&
      !this.connectAccount.contains(event.target)
    ) {
      this.toggleDropdown();
    }
  }

  render() {
    const { isLogged, address, className } = this.props;
    const s = this.state;

    return (
      <div
        className={classNames(Styles.ConnectAccount, className, {
          [Styles.ConnectAccount__selected]: s.dropdownOpen,
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
                  pointDown={s.dropdownOpen}
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
