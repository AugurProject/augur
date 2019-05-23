import React, { Component } from "react";
import { createBigNumber } from "utils/create-big-number";
import DerivationPath, {
  DEFAULT_DERIVATION_PATH,
  DERIVATION_PATH_TREZOR,
  DERIVATION_PATH_LEDGER,
  NUM_DERIVATION_PATHS_TO_DISPLAY,
} from "modules/auth/helpers/derivation-path";
import classNames from "classnames";
import AddressPickerContent from "modules/auth/components/common/address-picker-content";
import DerivationPathEditor from "modules/auth/components/common/derivation-path-editor";
import { ERROR_TYPES } from "modules/common-elements/constants";
import { errorIcon } from "modules/common/components/icons";
import { filter } from "lodash";
import Styles from "modules/auth/components/common/hardware-wallet.styles";
import StylesDropdown from "modules/auth/components/connect-dropdown/connect-dropdown.styles";
import StylesError from "modules/auth/components/common/error-container.styles";
import ToggleHeightStyles from "utils/toggle-height.styles";
import { getEthBalance } from "modules/contracts/actions/contractCalls";
import logError from "utils/log-error";

interface HardwareWalletProps {
  loginWithWallet: Function;
  walletName: string;
  showAdvanced: boolean;
  showError: Function;
  hideError: Function;
  error: boolean;
  setIsLoading: Function;
  setShowAdvancedButton: Function;
  isClicked: boolean;
  isLoading: boolean;
  onDerivationPathChange: Function;
  validation: Function;
}

interface HardwareWalletState {
  displayInstructions: boolean;
  baseDerivationPath: string;
  walletAddresses: Array<WalletObject>;
  addressPageNumber: number;
  showWallet: boolean;
  cachedAddresses: boolean;
}

interface WalletObject {
  address: string;
  balance: string;
  derivationPath: Array<number>;
  serializedPath: string;
}

export default class HardwareWallet extends Component<HardwareWalletProps, HardwareWalletState>  {
  public static sortBalanceDesc(obj1: WalletObject, obj2: WalletObject): number {
    return createBigNumber(obj2.balance)
      .minus(createBigNumber(obj1.balance))
      .toFixed();
  }

  private advanced: React.RefObject<HTMLInputElement>;
  private hardwareContent: React.RefObject<HTMLInputElement>;

  constructor(props: HardwareWalletProps) {
    super(props);

    this.state = {
      displayInstructions: true,
      baseDerivationPath: DEFAULT_DERIVATION_PATH,
      walletAddresses: new Array(NUM_DERIVATION_PATHS_TO_DISPLAY).fill(null),
      addressPageNumber: 1,
      showWallet: false,
      cachedAddresses: false,
    };

    this.advanced = React.createRef();
    this.hardwareContent = React.createRef();
    this.updateDisplayInstructions = this.updateDisplayInstructions.bind(this);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.validatePath = this.validatePath.bind(this);
    this.getWalletAddresses = this.getWalletAddresses.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
    this.hideHardwareWallet = this.hideHardwareWallet.bind(this);
    this.showHardwareWallet = this.showHardwareWallet.bind(this);
    this.getWalletAddressesWithBalance = this.getWalletAddressesWithBalance.bind(this);
  }

  public componentDidMount() {
    const { validation, setIsLoading } = this.props;
    if (!validation()) {
      this.updateDisplayInstructions(true);
      setIsLoading(false);
    }
  }

  public componentWillUpdate(nextProps: HardwareWalletProps, nextState: HardwareWalletState) {
    const { isLoading, isClicked, showAdvanced } = this.props;
    if (
      nextState.walletAddresses !== this.state.walletAddresses &&
      !nextState.walletAddresses.every((element: number) => !element)
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
        !nextState.walletAddresses.every((element: number) => !element)
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
      this.getWalletAddressesWithBalance().catch(logError);
    }

    if (showAdvanced !== nextProps.showAdvanced) {
      this.getWalletAddresses(DEFAULT_DERIVATION_PATH, 1).catch(logError);
    }

    if (this.state.displayInstructions !== nextState.displayInstructions) {
      this.updateDisplayInstructions(nextState.displayInstructions);
    }
  }

  public async getWalletAddresses(derivationPath: string, pageNumber: number, clearAddresses: boolean = true) {
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
        walletAddresses: [],
      });
    }
    const walletAddresses = await this.getBulkWalletAddressesWithBalances(
      [derivationPath],
      pageNumber,
      false,
    );

    this.setState({
      walletAddresses,
      addressPageNumber: pageNumber,
      cachedAddresses: false,
    });

    setIsLoading(false);
  }

  public async getWalletAddressesWithBalance() {
    const { validation, setIsLoading, walletName } = this.props;
    if (!validation()) {
      this.updateDisplayInstructions(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    this.updateDisplayInstructions(false);

    const derivationPath =
      walletName === "ledger" ? DERIVATION_PATH_LEDGER : DERIVATION_PATH_TREZOR;

    const walletAddresses = await this.getBulkWalletAddressesWithBalances(
      derivationPath,
      1,
    );

    if (walletAddresses.length > 0) {
      this.setState({
        walletAddresses,
        addressPageNumber: 1,
        cachedAddresses: true,
      });
      setIsLoading(false);
    } else {
      // no addresses found on scan use default path
      await this.getWalletAddresses(this.state.baseDerivationPath, 1);
    }
  }

  private async getBulkWalletAddressesWithBalances(
    paths: Array<string>,
    pageNumber: number,
    sortAndfilterBalances: boolean = true,
  ): Promise<Array<WalletObject>> {
    const { setIsLoading, onDerivationPathChange } = this.props;
    let walletAddresses: Array<WalletObject> = [];
    return new Promise((resolve, reject) => {
      onDerivationPathChange(paths, pageNumber) // only get 1 pages worth of addresses
        .catch((err: any) => {
          this.updateDisplayInstructions(true);
          setIsLoading(false);
          reject(new Error(err));
        })
        .then(async (result: { success: boolean, addresses: Array<WalletObject>}) => {
          if (result && result.success) {
            walletAddresses = result.addresses;
          } else {
            this.updateDisplayInstructions(true);
            setIsLoading(false);
            reject(new Error("no addresses found")); // no addresses found
          }

          for (const wallet of walletAddresses) {
            wallet.balance = await getEthBalance(wallet.address);
          }

          const walletAddressesWithBalances = sortAndfilterBalances
            ? filter(walletAddresses, (item: { balance: string }) => item.balance !== "0").sort(
                HardwareWallet.sortBalanceDesc,
              )
            : walletAddresses;

          resolve(walletAddressesWithBalances);

        });
    });
  }

  private updateDisplayInstructions(displayInstructions: boolean) {
    this.setState({ displayInstructions });
  }

  private async connectWallet(addressObject: WalletObject) {
    const { loginWithWallet } = this.props;
    return loginWithWallet(addressObject.derivationPath);
  }

  private async validatePath(value: string) {
    const { hideError, showError, walletName } = this.props;
    if (DerivationPath.validate(value)) {
      await this.getWalletAddresses(value, 1);
      hideError(walletName);
    } else {
      showError(ERROR_TYPES.INCORRECT_FORMAT);
    }
  }

  private showHardwareWallet() {
    this.setState({ showWallet: true });
  }

  private hideHardwareWallet() {
    const { setShowAdvancedButton } = this.props;
    setShowAdvancedButton(false);
    this.setState({ showWallet: false });
  }

  private async next() {
    const { cachedAddresses, addressPageNumber } = this.state;
    if (!cachedAddresses) {
      await this.getWalletAddresses(
        this.state.baseDerivationPath,
        addressPageNumber + 1,
        false,
      );
    }
    this.setState({
      addressPageNumber: addressPageNumber + 1,
    });
  }

  private previous() {
    const { addressPageNumber } = this.state;
    this.setState({
      addressPageNumber: addressPageNumber - 1,
    });
  }

  private render() {
    const {
      isLoading,
      error,
      walletName,
      showAdvanced,
      isClicked,
    } = this.props;
    const s = this.state;

    const lessThanPageAddresses =
      s.walletAddresses.length <=
      NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber;

    let indexes = [
      ...Array(NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber),
    ].map((_, i) => i);

    if (s.cachedAddresses) {
      indexes = indexes.slice(
        NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber -
          NUM_DERIVATION_PATHS_TO_DISPLAY,
        NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber >
          s.walletAddresses.length
          ? s.walletAddresses.length
          : NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber,
      );
    } else {
      indexes = indexes.slice(
        NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber -
          NUM_DERIVATION_PATHS_TO_DISPLAY,
        NUM_DERIVATION_PATHS_TO_DISPLAY * s.addressPageNumber,
      );
    }

    let hideContent = false;
    if (isLoading && s.walletAddresses.every((element: number) => !element)) {
      hideContent = true;
    }
    return (
      <div
        ref={(hardwareContent: React.RefObject<HTMLInputElement>) => {
          this.hardwareContent = hardwareContent;
        }}
        className={classNames(
          StylesDropdown.ConnectDropdown__hardwareContent,
          ToggleHeightStyles.target,
          {
            [ToggleHeightStyles.open]: s.showWallet,
          },
        )}
      >
        <div>
          <div
            ref={(advanced: React.RefObject<HTMLInputElement>) => {
              this.advanced = advanced;
            }}
            className={classNames(
              StylesDropdown.ConnectDropdown__advancedContent,
              ToggleHeightStyles.target,
              {
                [ToggleHeightStyles.open]: showAdvanced,
              },
            )}
          >
            <DerivationPathEditor
              validatePath={this.validatePath}
              isVisible={showAdvanced}
              isClicked={isClicked}
            />
          </div>
          {!error && !s.displayInstructions && !hideContent && (
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

          {!error && s.displayInstructions && (
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
                  Styles.subheader,
                )}
              >
                {walletName === "trezor" && (
                  <ul>
                    <li>Make sure you have connected your Trezor</li>
                    <li>Try dismissing Trezor web browser tab</li>
                    <li>
                      Disconnecting and reconnecting Trezor might fix the issue
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
                <div className={StylesDropdown.ConnectDropdown__retryContainer}>
                  <button
                    className={StylesDropdown.ConnectDropdown__retryButton}
                    onClick={async (e: any) => {
                      e.stopPropagation();
                      e.preventDefault();

                      await this.getWalletAddressesWithBalance();
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
