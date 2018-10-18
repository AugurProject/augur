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
    address: PropTypes.string
  };

  static defaultProps = {
    address: ""
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
              {isLogged ? formatAddress(address) : "Connect A Wallet"}
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
