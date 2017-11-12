import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { LedgerEthereum, BrowserLedgerConnectionFactory, Network } from 'ethereumjs-ledger'

import Spinner from 'modules/common/components/spinner/spinner'

import Styles from 'modules/auth/components/ledger-connect/ledger-connect.styles'

export default class Ledger extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    loginWithLedger: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.LEDGER_STATES = {
      ATTEMPTING_CONNECTION: 'ATTEMPTING_CONNECTION',
      CONNECT_LEDGER: 'CONNECT_LEDGER',
      OPEN_APP: 'OPEN_APP',
      SWITCH_MODE: 'SWITCH_MODE',
      ENABLE_CONTRACT_SUPPORT: 'ENABLE_CONTRACT_SUPPORT',
      OTHER_ISSUE: 'OTHER_ISSUE'
    }

    this.LedgerEthereum = null

    this.state = {
      ledgerState: null,
      displayInstructions: false
    }

    this.connectLedger = this.connectLedger.bind(this)
    this.onConnectLedgerRequest = this.onConnectLedgerRequest.bind(this)
    this.onOpenEthereumAppRequest = this.onOpenEthereumAppRequest.bind(this)
    this.onSwitchLedgerModeRequest = this.onSwitchLedgerModeRequest.bind(this)
    this.onEnableContractSupportRequest = this.onEnableContractSupportRequest.bind(this)
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextState.ledgerState !== this.LEDGER_STATES.ATTEMPTING_CONNECTION &&
      this.state.ledgerState !== nextState.ledgerState
    ) {
      this.setState({
        displayInstructions: true
      })
    }
  }


  // NOTE --  basically the only state that gets called is 'connect' until success,
  //          but potentially the other will at a later point
  async onConnectLedgerRequest() {
    this.setState(
      {
        ledgerState: this.LEDGER_STATES.CONNECT_LEDGER
      }
    )
  }

  async onOpenEthereumAppRequest() {
    this.setState(
      {
        ledgerState: this.LEDGER_STATES.OPEN_APP
      }
    )
  }

  async onSwitchLedgerModeRequest() {
    this.setState(
      {
        ledgerState: this.LEDGER_STATES.SWITCH_MODE
      }
    )
  }

  async onEnableContractSupportRequest() {
    this.setState(
      {
        ledgerState: this.LEDGER_STATES.ENABLE_CONTRACT_SUPPORT
      }
    )
  }

  async connectLedger() {
    this.setState({ ledgerState: this.LEDGER_STATES.ATTEMPTING_CONNECTION })

    const ledgerEthereum = new LedgerEthereum(
      Network.Main,
      BrowserLedgerConnectionFactory,
      this.onConnectLedgerRequest,
      this.onOpenEthereumAppRequest,
      this.onSwitchLedgerModeRequest,
      this.onEnableContractSupportRequest
    )

    const address = await ledgerEthereum.getAddressByBip44Index(0)

    if (address) {
      return this.props.loginWithLedger(address, ledgerEthereum)
    }

    this.setState({ ledgerStatus: this.LEDGER_STATES.OTHER_ISSUE })
  }

  render() {
    const s = this.state

    return (
      <section className={Styles.LedgerConnect}>
        <div
          className={Styles.LedgerConnect__action}
        >
          <button
            className={Styles.LedgerConnect__button}
            onClick={() => {
              this.connectLedger()
                .then(() => this.setState({ ledgerState: null }))
                .catch(() => this.setState({ ledgerState: this.LEDGER_STATES.OTHER_ISSUE }))
            }}
          >
            {s.ledgerState !== this.ATTEMPTING_CONNECTION ?
              'Connect Ledger' :
              <Spinner />
            }
          </button>
        </div>
        <div className={classNames(Styles.LedgerConnect__messages, { [Styles[`LedgerConnect__messages--visible`]]: s.ledgerState })}>
          <h3>Make sure you have: </h3>
          <ul>
            <li>
              Accessed Augur via HTTPS
            </li>
            <li>
              Connected your Ledger
            </li>
            <li>
              Opened the Ethereum App
            </li>
            <li>
              Enabled Contract Data
            </li>
            <li>
              Enabled Browser Support
            </li>
          </ul>
        </div>
      </section>
    )
  }
}
