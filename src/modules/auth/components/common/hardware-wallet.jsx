import React, { Component } from "react";
import PropTypes from "prop-types";

import DerivationPath, {
  DEFAULT_DERIVATION_PATH,
  NUM_DERIVATION_PATHS_TO_DISPLAY
} from "modules/auth/helpers/derivation-path";
import classNames from "classnames";
import AddressPickerContent from "modules/auth/components/common/address-picker-content";
import DerivationPathEditor from "modules/auth/components/common/derivation-path-editor";
import toggleHeight from "utils/toggle-height/toggle-height";
import { ERROR_TYPES } from "modules/auth/constants/connect-nav";
import { errorIcon } from "modules/common/components/icons";

import Styles from "modules/auth/components/common/hardware-wallet.styles";
import StylesDropdown from "modules/auth/components/connect-dropdown/connect-dropdown.styles";
import StylesError from "modules/auth/components/common/error-container.styles";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";

export default class HardwareWallet extends Component {
  static propTypes = {
    loginWithWallet: PropTypes.func.isRequired,
    walletName: PropTypes.string.isRequired,
    showAdvanced: PropTypes.bool.isRequired,
    showError: PropTypes.func.isRequired,
    hideError: PropTypes.func.isRequired,
    error: PropTypes.bool.isRequired,
    setIsLoading: PropTypes.func.isRequired,
    setShowAdvancedButton: PropTypes.func.isRequired,
    isClicked: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onDerivationPathChange: PropTypes.func.isRequired,
    validation: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      displayInstructions: true,
      baseDerivationPath: DEFAULT_DERIVATION_PATH,
      walletAddresses: new Array(NUM_DERIVATION_PATHS_TO_DISPLAY).fill(null),
      addressPageNumber: 1,
      showWallet: false
    };

    this.updateDisplayInstructions = this.updateDisplayInstructions.bind(this);
    this.buildDerivationPath = this.buildDerivationPath.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.validatePath = this.validatePath.bind(this);
    this.getWalletAddresses = this.getWalletAddresses.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
    this.hideHardwareWallet = this.hideHardwareWallet.bind(this);
    this.showHardwareWallet = this.showHardwareWallet.bind(this);
  }

  componentDidMount() {
    const { validation, setIsLoading } = this.props;
    if (!validation()) {
      this.updateDisplayInstructions(true);
      setIsLoading(false);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { isLoading, isClicked, showAdvanced } = this.props;
    if (
      nextState.walletAddresses !== this.state.walletAddresses &&
      !nextState.walletAddresses.every(element => !element)
    ) {
      nextProps.setShowAdvancedButton(true);
    }

    if (nextProps.isClicked && !this.state.showWallet) {
      // only if connection option was clicked and previously not shown do we want to show it
      if (!nextProps.isLoading && isLoading && nextState.displayInstructions) {
        // if it is not loading and before it was loading and instructions are going to be shown do we show it
        this.showHardwareWallet();
        nextProps.setShowAdvancedButton(false);
      } else if (
        !nextProps.isLoading &&
        isLoading &&
        !nextState.walletAddresses.every(element => !element)
      ) {
        // if it is not loading and before it was loading and addresses have been loaded
        this.showHardwareWallet();
        nextProps.setShowAdvancedButton(true);
      }
    } else if (!nextProps.isClicked && this.state.showWallet) {
      // if it has been clicked off and previously it was being shown do we hide
      this.hideHardwareWallet();
    }

    if (isClicked !== nextProps.isClicked && nextProps.isClicked) {
      // this is if the button was clicked, need to reupdate on click
      this.getWalletAddresses(DEFAULT_DERIVATION_PATH, 1);
    }

    if (this.state.addressPageNumber !== nextState.addressPageNumber) {
      this.getWalletAddresses(
        this.state.baseDerivationPath,
        nextState.addressPageNumber
      );
    }

    if (showAdvanced !== nextProps.showAdvanced) {
      this.showAdvanced(showAdvanced);
    }

    if (this.state.displayInstructions !== nextState.displayInstructions) {
      this.updateDisplayInstructions(nextState.displayInstructions);
    }
  }

  async getWalletAddresses(derivationPath, pageNumber, clearAddresses) {
    const { validation, setIsLoading, onDerivationPathChange } = this.props;
    if (!validation()) {
      this.updateDisplayInstructions(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    this.updateDisplayInstructions(false);

    if (clearAddresses) {
      this.setState({
        walletAddresses: []
      });
    }

    const result = await onDerivationPathChange(
      derivationPath,
      pageNumber
    ).catch(() => {
      this.updateDisplayInstructions(true);
      setIsLoading(false);
    });

    if (result.success) {
      this.setState({
        baseDerivationPath: derivationPath,
        walletAddresses: result.addresses,
        addressPageNumber: pageNumber
      });
    } else {
      this.updateDisplayInstructions(true);
    }
    setIsLoading(false);
  }

  updateDisplayInstructions(displayInstructions) {
    this.setState({ displayInstructions });
  }

  async connectWallet(pathIndex) {
    const { loginWithWallet } = this.props;
    const derivationPath = this.buildDerivationPath(pathIndex);

    return loginWithWallet(derivationPath);
  }

  buildDerivationPath(pathIndex) {
    return DerivationPath.buildString(
      DerivationPath.increment(
        DerivationPath.parse(this.state.baseDerivationPath),
        pathIndex
      )
    );
  }

  validatePath(value) {
    const { hideError, showError, walletName } = this.props;
    if (DerivationPath.validate(value)) {
      this.getWalletAddresses(value, 1);
      hideError(walletName);
    } else {
      showError(ERROR_TYPES.INCORRECT_FORMAT);
    }
  }

  showAdvanced(value) {
    toggleHeight(this.advanced, value, () => {});
  }

  showHardwareWallet() {
    toggleHeight(this.hardwareContent, false, () => {
      this.setState({ showWallet: true });
    });
  }

  hideHardwareWallet() {
    const { setShowAdvancedButton } = this.props;
    setShowAdvancedButton(false);
    toggleHeight(this.hardwareContent, true, () => {
      this.setState({ showWallet: false });
    });
  }

  next() {
    const { addressPageNumber } = this.state;
    this.setState({ addressPageNumber: addressPageNumber + 1 });
  }

  previous() {
    const { addressPageNumber } = this.state;
    this.setState({ addressPageNumber: addressPageNumber - 1 });
  }

  render() {
    const {
      isLoading,
      error,
      walletName,
      showAdvanced,
      isClicked
    } = this.props;
    const s = this.state;

    const indexes = [
      ...Array(NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber)
    ]
      .map((_, i) => i)
      .slice(
        NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber -
          NUM_DERIVATION_PATHS_TO_DISPLAY,
        NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber
      );

    let hideContent = false;
    if (isLoading && s.walletAddresses.every(element => !element)) {
      hideContent = true;
    }

    return (
      <div
        ref={hardwareContent => {
          this.hardwareContent = hardwareContent;
        }}
        className={classNames(
          StylesDropdown.ConnectDropdown__hardwareContent,
          ToggleHeightStyles["toggle-height-target"]
        )}
      >
        <div>
          <div
            ref={advanced => {
              this.advanced = advanced;
            }}
            className={classNames(
              StylesDropdown.ConnectDropdown__advancedContent,
              ToggleHeightStyles["toggle-height-target"]
            )}
          >
            <DerivationPathEditor
              validatePath={this.validatePath}
              isVisible={showAdvanced}
              isClicked={isClicked}
            />
          </div>
          {!error &&
            !s.displayInstructions &&
            !hideContent && (
              <AddressPickerContent
                addresses={s.walletAddresses}
                indexArray={indexes}
                clickAction={this.connectWallet}
                clickPrevious={this.previous}
                clickNext={this.next}
                disablePrevious={s.addressPageNumber === 1}
              />
            )}

          {!error &&
            s.displayInstructions && (
              <div className={StylesDropdown.ConnectDropdown__content}>
                <div className={StylesError.ErrorContainer__header}>
                  <div className={StylesError.ErrorContainer__headerIcon}>
                    {errorIcon}
                  </div>
                  Unable To Connect
                </div>
                <div
                  className={classNames(
                    StylesError.ErrorContainer__subheader,
                    Styles.ConnectWallet__subheader
                  )}
                >
                  {walletName === "trezor" && (
                    <ul>
                      <li>Make sure you have connected your Trezor</li>
                      <li>Try dismissing Trezor web browser tab</li>
                      <li>
                        Disconnecting and reconnecting Trezor might fix the
                        issue
                      </li>
                    </ul>
                  )}
                  {walletName === "ledger" && <div>Make sure you have:</div>}
                  {walletName === "ledger" && (
                    <ul>
                      <li>Accessed Augur via HTTPS</li>
                      <li>Connected your Ledger</li>
                      <li>Opened the Ethereum App</li>
                      <li>Enabled contract data</li>
                      <li>Enabled browser support</li>
                      <li>Unlocked Ledger Wallet</li>
                    </ul>
                  )}
                  <div
                    className={StylesDropdown.ConnectDropdown__retryContainer}
                  >
                    <button
                      className={StylesDropdown.ConnectDropdown__retryButton}
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();

                        this.getWalletAddresses(s.baseDerivationPath, 1, true);
                      }}
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    );
  }
}
