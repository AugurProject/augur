import React, { Component } from "react";
import PropTypes from "prop-types";

import DerivationPath, {
  NUM_DERIVATION_PATHS_TO_DISPLAY
} from "modules/auth/helpers/derivation-path";
import TrezorConnectImport from "trezor-connect";
import HardwareWallet from "modules/auth/components/common/hardware-wallet";

export default class TrezorConnect extends Component {
  static propTypes = {
    loginWithTrezor: PropTypes.func.isRequired,
    showAdvanced: PropTypes.bool,
    showError: PropTypes.func.isRequired,
    hideError: PropTypes.func.isRequired,
    error: PropTypes.bool,
    setIsLoading: PropTypes.func.isRequired,
    setShowAdvancedButton: PropTypes.func.isRequired,
    isClicked: PropTypes.bool,
    isLoading: PropTypes.bool
  };

  static async onDerivationPathChange(derivationPath, pageNumber = 1) {
    const components = DerivationPath.parse(derivationPath);
    const numberOfAddresses = NUM_DERIVATION_PATHS_TO_DISPLAY * pageNumber;
    const indexes = Array.from(Array(numberOfAddresses).keys());
    const addresses = [];

    const bundle = indexes.map(index => {
      const showOnTrezor = false;
      const path = DerivationPath.buildString(
        DerivationPath.increment(components, index)
      );
      return {
        path,
        showOnTrezor
      };
    });

    const response = await TrezorConnectImport.ethereumGetAddress({
      bundle
    }).catch(err => {
      console.log("Error:", err);
      return { success: false };
    });

    if (response.success) {
      // parse up the bundle results
      response.payload.every(item => addresses.push(item.address));
      if (addresses && addresses.length > 0) {
        if (!addresses.every(element => !element)) {
          return { success: true, addresses };
        }
      }
    }

    return { success: false };
  }

  constructor(props) {
    super(props);

    this.connectWallet = this.connectWallet.bind(this);
  }

  async connectWallet(derivationPath) {
    const { loginWithTrezor } = this.props;
    const result = await TrezorConnectImport.ethereumGetAddress({
      path: derivationPath
    });

    if (result.success) {
      const { address } = result.payload;

      if (address) {
        return loginWithTrezor(
          address.toLowerCase(),
          TrezorConnectImport,
          derivationPath
        );
      }
    }
  }

  render() {
    return (
      <HardwareWallet
        loginWithWallet={this.connectWallet}
        walletName="trezor"
        onDerivationPathChange={TrezorConnect.onDerivationPathChange}
        validation={() => true}
        {...this.props}
      />
    );
  }
}
