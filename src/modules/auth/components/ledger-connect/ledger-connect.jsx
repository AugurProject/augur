import React, { Component } from 'react'
import classNames from 'classnames'
import { LedgerEthereum, BrowserLedgerConnectionFactory, Network } from 'ethereumjs-ledger'

import Spinner from 'modules/common/components/spinner/spinner'

import Styles from 'modules/auth/components/ledger-connect/ledger-connect.styles'

export default class Ledger extends Component {
  constructor() {
    super()

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
    console.log('connect ledger')
    this.setState(
      {
        ledgerState: this.LEDGER_STATES.CONNECT_LEDGER
      }
    )
  }

  async onOpenEthereumAppRequest() {
    console.log('open app')
    this.setState(
      {
        ledgerState: this.LEDGER_STATES.OPEN_APP
      }
    )
  }

  async onSwitchLedgerModeRequest() {
    console.log('switch mode')

    this.setState(
      {
        ledgerState: this.LEDGER_STATES.SWITCH_MODE
      }
    )
  }

  async onEnableContractSupportRequest() {
    console.log('enable contract support')
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
    console.log(address)


    // const firstSignedMessagePromise = ledgerEthereum.signTransactionByBip44Index('e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080', 7)
    // const secondSignedMessagePromise = ledgerEthereum.signTransactionByBip32Path('e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080', "m/44'/60'/0'/0/7")
    // const firstSignedMessage = await firstSignedMessagePromise
    // const secondSignedMessage = await secondSignedMessagePromise
    // console.log(firstSignedMessage)
    // console.log(secondSignedMessage)
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
                // .catch(() => this.setState({ ledgerState: this.LEDGER_STATES.OTHER_ISSUE }))
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

// async function doStuff() {
//   const onConnectLedgerRequest = async () => { console.log('onConnectLedgerRequest') }
//   const onOpenEthereumAppRequest = async () => { console.log('onOpenEthereumAppRequest') }
//   const onSwitchLedgerModeRequest = async () => { console.log('onSwitchLedgerModeRequest') }
//   const onEnableContractSupportRequest = async () => { console.log('onEnableContractSupportRequest') }
//
//   const ledgerEthereum = new LedgerEthereum(Network.Main, BrowserLedgerConnectionFactory, onConnectLedgerRequest, onOpenEthereumAppRequest, onSwitchLedgerModeRequest, onEnableContractSupportRequest)
//   const address = await ledgerEthereum.getAddressByBip44Index(0)
//   console.log(address)
//   const firstSignedMessagePromise = ledgerEthereum.signTransactionByBip44Index('e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080', 7)
//   const secondSignedMessagePromise = ledgerEthereum.signTransactionByBip32Path('e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080', "m/44'/60'/0'/0/7")
//   const firstSignedMessage = await firstSignedMessagePromise
//   const secondSignedMessage = await secondSignedMessagePromise
//   console.log(firstSignedMessage)
//   console.log(secondSignedMessage)
// }
