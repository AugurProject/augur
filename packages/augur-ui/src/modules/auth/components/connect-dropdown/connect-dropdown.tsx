import React, { Component } from "react";
import classNames from "classnames";
import { PulseLoader } from "react-spinners";
import {
  ITEMS,
  WALLET_TYPE,
  ACCOUNT_TYPES,
  ERROR_TYPES,
} from "modules/common/constants";
import isMetaMaskPresent from "modules/auth/helpers/is-meta-mask";
import { LogoutIcon } from "modules/common/icons";

import Styles from "modules/auth/components/connect-dropdown/connect-dropdown.styles.less";
import Ledger from "modules/auth/containers/ledger-connect";
import Trezor from "modules/auth/containers/trezor-connect";
import ErrorContainer from "modules/auth/components/common/error-container";

interface ConnectDropdownProps {
  isLogged: boolean;
  connectMetaMask: Function;
  connectPortis: Function;
  toggleDropdown: Function;
  logout: Function;
  edgeLoginLink: Function;
  history: History;
}

interface ConnectDropdownState {
  selectedOption: null | string;
  showAdvanced: boolean;
  error: object | null | undefined;
  isLedgerLoading: boolean;
  isTrezorLoading: boolean;
  showAdvancedButton: boolean;
}

export default class ConnectDropdown extends Component<ConnectDropdownProps, ConnectDropdownState> {
  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      showAdvanced: false,
      error: null,
      isLedgerLoading: true,
      isTrezorLoading: true,
      showAdvancedButton: false,
    };

    this.showAdvanced = this.showAdvanced.bind(this);
    this.connect = this.connect.bind(this);
    this.logout = this.logout.bind(this);
    this.setIsLedgerLoading = this.setIsLedgerLoading.bind(this);
    this.setIsTrezorLoading = this.setIsTrezorLoading.bind(this);
    this.setShowAdvancedButton = this.setShowAdvancedButton.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.clearState = this.clearState.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.hideError = this.hideError.bind(this);
    this.showError = this.showError.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.isLogged !== this.props.isLogged) {
      this.clearState();
    }
  }

  setIsLedgerLoading(isLedgerLoading) {
    this.setState({ isLedgerLoading });
  }

  setIsTrezorLoading(isTrezorLoading) {
    this.setState({ isTrezorLoading });
  }

  setShowAdvancedButton(showAdvancedButton) {
    this.setState({ showAdvancedButton });
  }

  clearState() {
    this.setState({
      selectedOption: null,
      showAdvancedButton: false,
    });
  }

  closeMenu() {
    this.props.toggleDropdown();
    this.clearState();
  }

  showAdvanced(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ showAdvanced: !this.state.showAdvanced });
  }

  connect(param) {
    const { history, connectMetaMask, connectPortis, edgeLoginLink } = this.props;
    if (param === ACCOUNT_TYPES.METAMASK) {
      if (!isMetaMaskPresent()) {
        this.showError(ERROR_TYPES.UNABLE_TO_CONNECT);
        return;
      }
      connectMetaMask((err, res) => {
        if (err) {
          this.showError(ERROR_TYPES.NOT_SIGNED_IN);
        }
      });
    } else if (param === ACCOUNT_TYPES.EDGE) {
      edgeLoginLink(history);
      this.closeMenu();
    } else if (param === ACCOUNT_TYPES.PORTIS) {
      connectPortis((err, res) => {
        if (err) {
          console.error(err);
          this.showError({
            header: "Unable To Connect",
            subheader: err,
          });
        }
      });
    }
  }

  showError(error) {
    this.setState({ error });
  }

  hideError() {
    this.setState({ error: null });
  }

  selectOption(param) {
    const prevSelected = this.state.selectedOption;

    this.setState({
      error: null,
      showAdvanced: false,
      isLedgerLoading: true,
      isTrezorLoading: true,
      selectedOption: null
    });

    if (prevSelected !== param) {
      // new selection being made
      this.setState({ selectedOption: param });
      this.connect(param);
    } else {
      // deselection is being done
      this.setState({ selectedOption: null });
    }
  }

  logout() {
    const { toggleDropdown, logout } = this.props;
    toggleDropdown(() => {
      setTimeout(() => {
        // need to wait for animation to be done
        logout();
      }, 500);
    });
  }

  render() {
    const { isLogged } = this.props;
    const s = this.state;

    return (
      <div className={Styles.ConnectDropdown}>
        {isLogged && (
          <div>
            <div
              className={classNames(Styles.ConnectDropdown__item)}
              onClick={() => this.logout()}
              role="button"
              tabIndex={-1}
            >
              <div className={Styles.ConnectDropdown__icon}>{LogoutIcon()}</div>
              <div className={Styles.ConnectDropdown__title}>Logout</div>
            </div>
          </div>
        )}
        {!isLogged && (
          <div
            className={classNames(
              Styles.ConnectDropdown__item,
              Styles.ConnectDropdown_explanation,
            )}
          >
            Connect a wallet to log into Augur.{" "}
            {!process.env.AUGUR_HOSTED
              ? "Use Edge to login with a username and password."
              : null}
          </div>
        )}
        {!isLogged &&
          ITEMS.map((item) => (
            <div key={item.param}>
              <div
                className={classNames(Styles.ConnectDropdown__item, {
                  [Styles.ConnectDropdown__itemSelected]:
                    s.selectedOption === item.param,
                  [Styles.ConnectDropdown__itemHardwareSelected]:
                    s.selectedOption === item.param &&
                    ((item.type === WALLET_TYPE.HARDWARE &&
                      (s.showAdvancedButton ||
                        !s.isLedgerLoading ||
                        !s.isTrezorLoading)) ||
                      s.error),
                })}
                onClick={() => this.selectOption(item.param)}
                role="button"
                tabIndex={-1}
              >
                <div className={Styles.ConnectDropdown__icon}>{item.icon}</div>
                <div className={Styles.ConnectDropdown__title}>
                  {item.title}
                  {s.selectedOption === item.param && (
                    <div style={{ marginLeft: "8px" }}>
                      <PulseLoader
                        color="#FFF"
                        sizeUnit="px"
                        size={8}
                        loading
                      />
                    </div>
                  )}
                </div>

                {s.selectedOption === item.param &&
                  item.type === WALLET_TYPE.HARDWARE &&
                  s.showAdvancedButton && (
                    <button
                      style={{ padding: "10px" }}
                      onClick={this.showAdvanced}
                    >
                      <div className={Styles.ConnectDropdown__advanced}>
                        Advanced
                      </div>
                    </button>
                  )}
              </div>
              {item.type === WALLET_TYPE.HARDWARE &&
                item.param === "ledger" && (
                  <Ledger
                    dropdownItem={item}
                    showAdvanced={
                      s.selectedOption === "ledger" && s.showAdvanced
                    }
                    error={Boolean(s.selectedOption === item.param && s.error)}
                    showError={this.showError}
                    hideError={this.hideError}
                    setIsLoading={this.setIsLedgerLoading}
                    isClicked={s.selectedOption === item.param}
                    isLoading={s.isLedgerLoading}
                    setShowAdvancedButton={this.setShowAdvancedButton}
                  />
                )}
              {item.type === WALLET_TYPE.HARDWARE &&
                item.param === "trezor" && (
                  <Trezor
                    dropdownItem={item}
                    showAdvanced={
                      s.selectedOption === "trezor" && s.showAdvanced
                    }
                    error={Boolean(s.selectedOption === item.param && s.error)}
                    showError={this.showError}
                    hideError={this.hideError}
                    setIsLoading={this.setIsTrezorLoading}
                    onSuccess={() => this.closeMenu()}
                    isClicked={s.selectedOption === item.param}
                    isLoading={s.isTrezorLoading}
                    setShowAdvancedButton={this.setShowAdvancedButton}
                  />
                )}
              <ErrorContainer
                error={s.error}
                connect={this.connect}
                isSelected={s.selectedOption === item.param}
              />
            </div>
          ))}
      </div>
    );
  }
}
