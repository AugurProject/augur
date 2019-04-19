import React, { Component } from "react";
import PropTypes from "prop-types";
import { createBigNumber } from "utils/create-big-number";
import DerivationPath, {
  DEFAULT_DERIVATION_PATH,
  DERIVATION_PATHS,
  NUM_DERIVATION_PATHS_TO_DISPLAY
} from "modules/auth/helpers/derivation-path";
import classNames from "classnames";
import AddressPickerContent from "modules/auth/components/common/address-picker-content";
import DerivationPathEditor from "modules/auth/components/common/derivation-path-editor";
import toggleHeight from "utils/toggle-height/toggle-height";
import { ERROR_TYPES } from "modules/common-elements/constants";
import { errorIcon } from "modules/common/components/icons";
import { filter } from "lodash";
import Styles from "modules/auth/components/common/hardware-wallet.styles";
import StylesDropdown from "modules/auth/components/connect-dropdown/connect-dropdown.styles";
import StylesError from "modules/auth/components/common/error-container.styles";
import ToggleHeightStyles from "utils/toggle-height/toggle-height.styles";
import getEtherBalance from "modules/auth/actions/get-ether-balance";

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

  static sortBalanceDesc(obj1, obj2) {
    return createBigNumber(obj2.balance)
      .minus(createBigNumber(obj1.balance))
      .toFixed();
  }

  constructor(props) {
    super(props);

    this.state = {
      displayInstructions: true,
      baseDerivationPath: DEFAULT_DERIVATION_PATH,
      walletAddresses: new Array(NUM_DERIVATION_PATHS_TO_DISPLAY).fill(null),
      addressPageNumber: 1,
      showWallet: false,
      cachedAddresses: false
    };

    this.updateDisplayInstructions = this.updateDisplayInstructions.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.validatePath = this.validatePath.bind(this);
    this.getWalletAddresses = this.getWalletAddresses.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
    this.hideHardwareWallet = this.hideHardwareWallet.bind(this);
    this.showHardwareWallet = this.showHardwareWallet.bind(this);
    this.getWalletAddressesWithBalance = this.getWalletAddressesWithBalance.bind(
      this
    );
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
      this.getWalletAddressesWithBalance();
    }

    if (showAdvanced !== nextProps.showAdvanced) {
      this.showAdvanced(showAdvanced);
      this.getWalletAddresses(DEFAULT_DERIVATION_PATH, 1);
    }

    if (this.state.displayInstructions !== nextState.displayInstructions) {
      this.updateDisplayInstructions(nextState.displayInstructions);
    }
  }

  async getWalletAddresses(derivationPath, pageNumber, clearAddresses = true) {
    const { validation, setIsLoading } = this.props;
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
    const walletAddresses = await this.getBulkWalletAddressesWithBalances(
      [derivationPath],
      pageNumber,
      false
    );

    this.setState({
      walletAddresses,
      addressPageNumber: pageNumber,
      cachedAddresses: false
    });

    setIsLoading(false);
  }

  async getWalletAddressesWithBalance() {
    const { validation, setIsLoading } = this.props;
    if (!validation()) {
      this.updateDisplayInstructions(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    this.updateDisplayInstructions(false);

    const walletAddresses = await this.getBulkWalletAddressesWithBalances(
      DERIVATION_PATHS,
      1
    );

    if (walletAddresses.length > 0) {
      this.setState({
        walletAddresses,
        addressPageNumber: 1,
        cachedAddresses: true
      });
      setIsLoading(false);
    } else {
      // no addresses found on scan use default path
      this.getWalletAddresses(this.state.baseDerivationPath, 1);
    }
  }

  async getBulkWalletAddressesWithBalances(
    paths,
    pageNumber,
    sortAndfilterBalances = true
  ) {
    const { setIsLoading, onDerivationPathChange } = this.props;
    let walletAddresses = [];
    return new Promise((resolve, reject) => {
      onDerivationPathChange(paths, pageNumber) // only get 1 pages worth of addresses
        .catch(e => {
          this.updateDisplayInstructions(true);
          setIsLoading(false);
          reject(new Error(e));
        })
        .then(result => {
          if (result && result.success) {
            walletAddresses = result.addresses;
          } else {
            this.updateDisplayInstructions(true);
            setIsLoading(false);
            reject(new Error("no addresses found")); // no addresses found
          }
          const promises = [];
          walletAddresses.forEach(addr => {
            const getPromise = new Promise((resolve, reject) => {
              getEtherBalance(addr.address, (err, balance, address) => {
                if (err) return reject(new Error(err));
                resolve({ balance, address });
              });
            });
            promises.push(getPromise);
          });

          Promise.all(promises).then(results => {
            results.forEach(result => {
              if (result && result.address) {
                const value = walletAddresses.find(
                  addr => addr.address === result.address
                );
                if (value) {
                  value.balance = result.balance;
                }
              }
            });

            const walletAddressesWithBalances = sortAndfilterBalances
              ? filter(walletAddresses, item => item.balance !== "0").sort(
                  HardwareWallet.sortBalanceDesc
                )
              : walletAddresses;

            resolve(walletAddressesWithBalances);
          });
        });
    });
  }

  updateDisplayInstructions(displayInstructions) {
    this.setState({ displayInstructions });
  }

  async connectWallet(addressObject) {
    const { loginWithWallet } = this.props;
    return loginWithWallet(addressObject.derivationPath);
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
    toggleHeight(this.advanced, value);
  }

  showHardwareWallet() {
    toggleHeight(this.hardwareContent, false, 0, () => {
      this.setState({ showWallet: true });
    });
  }

  hideHardwareWallet() {
    const { setShowAdvancedButton } = this.props;
    setShowAdvancedButton(false);
    toggleHeight(this.hardwareContent, true, 0, () => {
      this.setState({ showWallet: false });
    });
  }

  next() {
    const { cachedAddresses, addressPageNumber } = this.state;
    if (!cachedAddresses) {
      this.getWalletAddresses(
        this.state.baseDerivationPath,
        addressPageNumber + 1,
        false
      );
    }
    this.setState({
      addressPageNumber: addressPageNumber + 1
    });
  }

  previous() {
    const { addressPageNumber } = this.state;
    this.setState({
      addressPageNumber: addressPageNumber - 1
    });
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

    const lessThanPageAddresses =
      s.walletAddresses.length <=
      NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber;

    let indexes = [
      ...Array(NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber)
    ].map((_, i) => i);

    if (s.cachedAddresses) {
      indexes = indexes.slice(
        NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber -
          NUM_DERIVATION_PATHS_TO_DISPLAY,
        NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber >
        s.walletAddresses.length
          ? s.walletAddresses.length
          : NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber
      );
    } else {
      indexes = indexes.slice(
        NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber -
          NUM_DERIVATION_PATHS_TO_DISPLAY,
        NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber
      );
    }

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
                disableNext={lessThanPageAddresses && s.cachedAddresses}
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

                        this.getWalletAddressesWithBalance();
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
