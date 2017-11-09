import React, { Component } from 'react'
import { LedgerEthereum, BrowserLedgerConnectionFactory, Network } from 'ethereumjs-ledger'

export default class Ledger extends Component {
  constructor() {
    super()

    this.LEDGER_STATES = {
      CONNECT_LEDGER: 'CONNECT_LEDGER',
      OPEN_APP: 'OPEN_APP',
      SWITCH_MODE: 'SWITCH_MODE',
      ENABLE_CONTRACT_SUPPORT: 'ENABLE_CONTRACT_SUPPORT'
    }

    this.LedgerEthereum = null

    this.state = {
      ledgerState: null
    }

    // this.setupLedger = this.setupLedger.bind(this)
    this.onConnectLedgerRequest = this.onConnectLedgerRequest.bind(this)
    this.onOpenEthereumAppRequest = this.onOpenEthereumAppRequest.bind(this)
    this.onSwitchLedgerModeRequest = this.onSwitchLedgerModeRequest.bind(this)
    this.onEnableContractSupportRequest = this.onEnableContractSupportRequest.bind(this)
  }

  componentWillMount() {
    this.setupLedger()
  }

  async onConnectLedgerRequest() {
    console.log('connect ledger')
    await new Promise(resolve => this.setState(
      {
        ledgerState: this.LEDGER_STATES.CONNECT_LEDGER
      },
      () => {
        resolve()
      }
    ))
  }

  async onOpenEthereumAppRequest() {
    console.log('open app')

    await new Promise(resolve => this.setState(
      {
        ledgerState: this.LEDGER_STATES.OPEN_APP
      },
      () => {
        resolve()
      }
    ))
  }

  async onSwitchLedgerModeRequest() {
    console.log('switch mode')

    await new Promise(resolve => this.setState(
      {
        ledgerState: this.LEDGER_STATES.SWITCH_MODE
      },
      () => {
        resolve()
      }
    ))
  }

  async onEnableContractSupportRequest() {
    console.log('enable contract support')

    await new Promise(resolve => this.setState(
      {
        ledgerState: this.LEDGER_STATES.ENABLE_CONTRACT_SUPPORT
      },
      () => {
        resolve()
      }
    ))
  }

  // async setupLedger() {
  //   // console.log('setup!')
  //   //
  //   //
  //   //
  //   // this.ledgerEthereum = new LedgerEthereum(
  //   //   Network.Main,
  //   //   BrowserLedgerConnectionFactory,
  //   //   this.onConnectLedgerRequest,
  //   //   this.onOpenEthereumAppRequest,
  //   //   this.onSwitchLedgerModeRequest,
  //   //   this.onEnableContractSupportRequest
  //   // )
  //   //
  //   // console.log('ledgerEthereum -- ', ledgerEthereum)
  //   //
  //   // const address = await ledgerEthereum.getAddressByBip44Index(0)
  //   //
  //   // console.log('address -- ', address)
  //   // const firstSignedMessagePromise = ledgerEthereum.signTransactionByBip44Index("e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080", 7)
  //   // const secondSignedMessagePromise = ledgerEthereum.signTransactionByBip32Path("e8018504e3b292008252089428ee52a8f3d6e5d15f8b131996950d7f296c7952872bd72a2487400080", "m/44'/60'/0'/0/7")
  //
  //   // this will block until both first and second messages are done because the library handles ordering internally
  //   // const secondSignedMessage = await secondSignedMessage;
  //
  //   // if the ledger isn't connected with the Ethereum app open in browser mode, the on*Request callbacks above will be called before the signing promises return
  //   // const firstSignedMessage = await firstSignedMessage;
  //
  //   // BIP44 index 7 is the same as `m/44'/60'/0'/0/7`; it is strongly recommended to use index 0 if you don't support multi-address wallets
  //   // assert.equal(firstSignedMessage, secondSignedMessage);
  // }

  render() {
    const s = this.state

    console.log('state -- ', s)

    return (
      <button
        onClick={() => {
          new LedgerEthereum(
            Network.Main,
            BrowserLedgerConnectionFactory,
            this.onConnectLedgerRequest,
            this.onOpenEthereumAppRequest,
            this.onSwitchLedgerModeRequest,
            this.onEnableContractSupportRequest
          ).getAddressByBip44Index(0)
        }
      }
      >
        CHECK
      </button>
    )
  }
}
