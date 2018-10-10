import React, { Component } from "react";
import PropTypes from "prop-types";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import Eth from "@ledgerhq/hw-app-eth";

import DerivationPath, {
  NUM_DERIVATION_PATHS_TO_DISPLAY
} from "modules/auth/helpers/derivation-path";
import HardwareWallet from "modules/auth/components/common/hardware-wallet";

export default class Ledger extends Component {
  static propTypes = {
    loginWithLedger: PropTypes.func.isRequired,
    showAdvanced: PropTypes.bool,
    showError: PropTypes.func.isRequired,
    hideError: PropTypes.func.isRequired,
    error: PropTypes.bool,
    setIsLoading: PropTypes.func.isRequired,
    setShowAdvancedButton: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    isClicked: PropTypes.bool,
    isLoading: PropTypes.bool
  };

  static ledgerValidation() {
    if (location.protocol !== "https:") {
      return false;
    }
    return true;
  }

  static async onDerivationPathChange(derivationPath, pageNumber = 1) {
    const transport = await TransportU2F.create();
    const ledgerEthereum = new Eth(transport);

    const components = DerivationPath.parse(derivationPath);
    const numberOfAddresses = NUM_DERIVATION_PATHS_TO_DISPLAY * pageNumber;
    const indexes = Array.from(Array(numberOfAddresses).keys());
    const addresses = [];

    // ledger can only take one request at a time, can't stack up promises
    /* eslint-disable */
    for (const index of indexes) {
      const result = await ledgerEthereum
        .getAddress(
          DerivationPath.buildString(
            DerivationPath.increment(components, index)
          ),
          false,
          true
        )
        .catch(err => {
          console.log("Error:", err);
          return { success: false };
        });
      addresses.push(result && result.address);
    }
    /* eslint-enable */

    if (addresses && addresses.length > 0) {
      if (!addresses.every(element => !element)) {
        return { success: true, addresses };
      }
    }

    return { success: false };
  }

  constructor(props) {
    super(props);

    this.connectWallet = this.connectWallet.bind(this);
  }

  async connectWallet(derivationPath) {
    const { loginWithLedger, logout } = this.props;
    const transport = await TransportU2F.create();

    transport.on("disconnect", () => {
      console.log("Ledger is disconected");
      logout();
    });

    const ledgerEthereum = new Eth(transport);
    const result = await ledgerEthereum.getAddress(derivationPath);
    const { address } = result;

    if (address) {
      return loginWithLedger(
        address.toLowerCase(),
        ledgerEthereum,
        derivationPath
      );
    }
  }

  render() {
    return (
      <HardwareWallet
        loginWithWallet={this.connectWallet}
        walletName="ledger"
        onDerivationPathChange={Ledger.onDerivationPathChange}
        validation={Ledger.ledgerValidation}
        {...this.props}
      />
    );
  }
}
