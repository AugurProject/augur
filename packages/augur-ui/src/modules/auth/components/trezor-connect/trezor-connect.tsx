import React, { Component } from "react";
import DerivationPath, { NUM_DERIVATION_PATHS_TO_DISPLAY } from "modules/auth/helpers/derivation-path";
import { TREZOR_MANIFEST_EMAIL, TREZOR_MANIFEST_APP } from "modules/auth/constants/trezor-manifest";
import TrezorConnect, { DEVICE_EVENT, DEVICE } from "trezor-connect";
import HardwareWallet from "modules/auth/components/common/hardware-wallet";


TrezorConnect.manifest({
  email: TREZOR_MANIFEST_EMAIL,
  appUrl: TREZOR_MANIFEST_APP,
});

interface TrezorConnectWrapperProps {
  loginWithTrezor: Function;
  showAdvanced: boolean;
  showError: Function;
  hideError: Function;
  error: boolean;
  onSuccess: Function;
  setIsLoading: Function;
  setShowAdvancedButton: Function;
  isClicked: boolean;
  isLoading: boolean;
  logout: Function;
}

interface TrezorPayloadObject {
  address: string;
  derivationPath: Array<number>;
  serializedPath: string;
}

export default class TrezorConnectWrapper extends Component<TrezorConnectWrapperProps, void> {
  static async onDerivationPathChange(derivationPaths: Array<string>, pageNumber: number = 1) {
    const paths: Array<string> = [];

    derivationPaths.forEach((derivationPath: string) => {
      const components = DerivationPath.parse(derivationPath);
      const numberOfAddresses = NUM_DERIVATION_PATHS_TO_DISPLAY * pageNumber;
      const indexes = Array.from(Array(numberOfAddresses).keys());
      indexes.forEach((index: number) => {
        const derivationPath = DerivationPath.buildString(
          DerivationPath.increment(components, index),
        );
        paths.push(derivationPath);
      });
    });

    const addresses: Array<TrezorPayloadObject> = [];

    const bundle = paths.map((path: string) => ({
      path,
      showOnTrezor: false,
    }));

    const response = await TrezorConnect.ethereumGetAddress({
      bundle,
    }).catch((err: any) => {
      console.log("Error:", err);
      return { success: false };
    });

    if (response.success) {
      // parse up the bundle results
      response.payload.every((item: { address: string, path: Array<number>, serializedPath: string }) => {
        return addresses.push({
          address: item.address,
          derivationPath: item.path,
          serializedPath: item.serializedPath,
        });
      });

      if (addresses && addresses.length > 0) {
        if (!addresses.every((element) => !element.address)) {
          return { success: true, addresses };
        }
      }
    }

    return { success: false };
  }

  constructor(props: TrezorConnectWrapperProps) {
    super(props);

    this.connectWallet = this.connectWallet.bind(this);
  }

  async connectWallet(derivationPath: string) {
    const { loginWithTrezor, logout } = this.props;
    const result = await TrezorConnect.ethereumGetAddress({
      path: derivationPath,
    });

    TrezorConnect.on(DEVICE_EVENT, (event: any) => {
      switch (event.type) {
        case DEVICE.DISCONNECT: {
          logout();
          break;
        }
        default:
          break;
      }
    });

    if (result.success) {
      const { address } = result.payload;

      if (address) {
        this.props.onSuccess();

        return loginWithTrezor(
          address.toLowerCase(),
          TrezorConnect,
          derivationPath,
        );
      }
    } else {
      console.error("Could not connect to Trezor", result);
    }
  }

  render() {
    return (
      <HardwareWallet
        loginWithWallet={this.connectWallet}
        walletName="trezor"
        onDerivationPathChange={TrezorConnectWrapper.onDerivationPathChange}
        validation={() => true}
        {...this.props}
      />
    );
  }
}
