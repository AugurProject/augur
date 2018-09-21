import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { PulseLoader } from "react-spinners";

import {
  ITEMS,
  WALLET_TYPE,
  PARAMS,
  ERROR_TYPES
} from "modules/auth/constants/connect-nav";
import isMetaMaskPresent from "src/modules/auth/helpers/is-meta-mask";

import Styles from "modules/auth/components/connect-dropdown/connect-dropdown.styles";
import Ledger from "modules/auth/containers/ledger-connect";
import Trezor from "modules/auth/containers/trezor-connect";
import ErrorContainer from "modules/auth/components/common/error-container";

export default class ConnectDropdown extends Component {
  static propTypes = {
    isLogged: PropTypes.bool,
    connectMetaMask: PropTypes.func.isRequired,
    toggleDropdown: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    edgeLoginLink: PropTypes.func.isRequired,
    edgeLoading: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedOption: null,
      showAdvanced: false,
      error: null,
      isLedgerLoading: true,
      isTrezorLoading: true,
      showAdvancedButton: false
    };

    this.showAdvanced = this.showAdvanced.bind(this);
    this.connect = this.connect.bind(this);
    this.logout = this.logout.bind(this);
    this.setIsLedgerLoading = this.setIsLedgerLoading.bind(this);
    this.setIsTrezorLoading = this.setIsTrezorLoading.bind(this);
    this.setShowAdvancedButton = this.setShowAdvancedButton.bind(this);
    this.selectOption = this.selectOption.bind(this);
    this.clearState = this.clearState.bind(this);
    this.hideError = this.hideError.bind(this);
    this.showError = this.showError.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.isLogged !== this.props.isLogged) {
      this.clearState();
    }
  }

  setIsLedgerLoading(value) {
    this.setState({ isLedgerLoading: value });
  }

  setIsTrezorLoading(value) {
    this.setState({ isTrezorLoading: value });
  }

  setShowAdvancedButton(value) {
    this.setState({ showAdvancedButton: value });
  }

  clearState() {
    this.setState({
      selectedOption: null,
      showAdvancedButton: false
    });
  }

  showAdvanced(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ showAdvanced: !this.state.showAdvanced });
  }

  connect(param) {
    if (param === PARAMS.METAMASK) {
      if (!isMetaMaskPresent()) {
        this.showError(param, ERROR_TYPES.UNABLE_TO_CONNECT);
        return;
      }
      this.props.connectMetaMask((err, res) => {
        if (err) {
          this.showError(param, ERROR_TYPES.NOT_SIGNED_IN);
        }
      });
    } else if (param === PARAMS.EDGE) {
      this.props.edgeLoginLink(this.props.history);
    }
  }

  showError(param, error) {
    this.setState({ error });
  }

  hideError(param) {
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
    this.props.toggleDropdown(() => {
      setTimeout(() => {
        // need to wait for animation to be done
        this.props.logout();
      }, 500);
    });
  }

  render() {
    const { isLogged, edgeLoading } = this.props;
    const s = this.state;

    return (
      <div className={Styles.ConnectDropdown}>
        {isLogged && (
          <div
            className={classNames(Styles.ConnectDropdown__item)}
            onClick={this.logout}
            role="button"
            tabIndex="-1"
          >
            Logout
          </div>
        )}
        {!isLogged &&
          ITEMS.map(item => (
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
                      s.error)
                })}
                onClick={() => this.selectOption(item.param)}
                role="button"
                tabIndex="-1"
              >
                <div className={Styles.ConnectDropdown__icon}>{item.icon}</div>
                <div className={Styles.ConnectDropdown__title}>
                  {item.title}
                  {s.selectedOption === item.param &&
                    ((item.param === PARAMS.EDGE && edgeLoading) ||
                      (item.param === PARAMS.LEDGER && s.isLedgerLoading) ||
                      (item.param === PARAMS.TREZOR && s.isTrezorLoading)) && (
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
                    isClicked={s.selectedOption === item.param}
                    isLoading={s.isTrezorLoading}
                    setShowAdvancedButton={this.setShowAdvancedButton}
                  />
                )}
              <ErrorContainer
                error={s.error}
                connect={this.connect}
                param={item.param}
                isSelected={s.selectedOption === item.param}
              />
            </div>
          ))}
      </div>
    );
  }
}
