import React, { Component } from "react";
import PropTypes from "prop-types";
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import Eth from "@ledgerhq/hw-app-eth";

import * as LEDGER_STATES from "modules/auth/constants/ledger-status";

import { Alert } from "modules/common/components/icons";

import Spinner from "modules/common/components/spinner/spinner";

import Styles from "modules/auth/components/ledger-connect/ledger-connect.styles";

export default class Ledger extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    loginWithLedger: PropTypes.func.isRequired,
    networkId: PropTypes.number.isRequired,
    updateLedgerStatus: PropTypes.func.isRequired,
    ledgerStatus: PropTypes.string.isRequired,
    onConnectLedgerRequest: PropTypes.func.isRequired,
    onOpenEthereumAppRequest: PropTypes.func.isRequired,
    onSwitchLedgerModeRequest: PropTypes.func.isRequired,
    onEnableContractSupportRequest: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.LedgerEthereum = null;

    this.state = {
      displayInstructions: false,
      derivationPath: "m/44'/60'/0'/0/0"
    };

    this.connectLedger = this.connectLedger.bind(this);
    this.updateDisplayInstructions = this.updateDisplayInstructions.bind(this);
    this.onConnectLedgerRequestHook = this.onConnectLedgerRequestHook.bind(
      this
    );
    this.onOpenEthereumAppRequestHook = this.onOpenEthereumAppRequestHook.bind(
      this
    );
    this.onSwitchLedgerModeRequestHook = this.onSwitchLedgerModeRequestHook.bind(
      this
    );
    this.onEnableContractSupportRequestHook = this.onEnableContractSupportRequestHook.bind(
      this
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextProps.ledgerStatus !== LEDGER_STATES.ATTEMPTING_CONNECTION &&
      this.props.ledgerStatus !== nextProps.ledgerStatus
    ) {
      this.updateDisplayInstructions(true);
    }
  }

  async onConnectLedgerRequestHook() {
    this.props.onConnectLedgerRequest();
  }

  async onOpenEthereumAppRequestHook() {
    this.props.onOpenEthereumAppRequest();
  }

  async onSwitchLedgerModeRequestHook() {
    this.props.onSwitchLedgerModeRequest();
  }

  async onEnableContractSupportRequestHook() {
    this.props.onEnableContractSupportRequest();
  }

  async connectLedger() {
    const { loginWithLedger } = this.props;
    this.props.updateLedgerStatus(LEDGER_STATES.ATTEMPTING_CONNECTION);

    if (location.protocol !== "https:") {
      this.props.updateLedgerStatus(LEDGER_STATES.OTHER_ISSUE);
    }

    const transport = await TransportU2F.create();
    const ledgerEthereum = new Eth(transport);
    const result = await ledgerEthereum.getAddress(this.state.derivationPath);
    const { address } = result;
    // 0x9C5faA7b3C782cab129fb537f6024754eb7A09Bf
    if (address) {
      return loginWithLedger(
        address.toLowerCase(),
        ledgerEthereum,
        this.state.derivationPath
      );
    }

    this.props.updateLedgerStatus(LEDGER_STATES.OTHER_ISSUE);
  }

  updateDisplayInstructions(displayInstructions) {
    this.setState({ displayInstructions });
  }

  render() {
    const { ledgerStatus, updateLedgerStatus } = this.props;
    const s = this.state;

    return (
      <section className={Styles.LedgerConnect}>
        <div className={Styles.LedgerConnect__action}>
          <button
            className={Styles.LedgerConnect__button}
            onClick={() => {
              this.connectLedger().catch(() =>
                updateLedgerStatus(LEDGER_STATES.OTHER_ISSUE)
              );
            }}
          >
            {ledgerStatus !== LEDGER_STATES.ATTEMPTING_CONNECTION ? (
              "Connect Ledger"
            ) : (
              <Spinner light />
            )}
          </button>
        </div>
        {s.displayInstructions && (
          <div className={Styles.LedgerConnect__messages}>
            {Alert}
            <h3>Make sure you have: </h3>
            <ul>
              <li>Accessed Augur via HTTPS</li>
              <li>Connected your Ledger</li>
              <li>Opened the Ethereum App</li>
              <li>Enabled Contract Data</li>
              <li>Enabled Browser Support</li>
            </ul>
          </div>
        )}
      </section>
    );
  }
}
