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

    this.state = {
      ledgerState: null
    }

    this.setupLedger = this.setupLedger.bind(this)
  }

  componentWillMount() {
    this.setupLedger()
  }

  setupLedger() {
    console.log('setup!')

    const onConnectLedgerRequest = () => new Promise(resolve => this.setState(
      {
        ledgerState: this.LEDGER_STATES.CONNECT_LEDGER
      },
      () => resolve()
    ))

    const onOpenEthereumAppRequest = () => new Promise(resolve => this.setState(
      {
        ledgerState: this.LEDGER_STATES.OPEN_APP
      },
      () => resolve()
    ))

    const onSwitchLedgerModeRequest = () => new Promise(resolve => this.setState(
      {
        ledgerState: this.LEDGER_STATES.SWITCH_MODE
      },
      () => resolve()
    ))

    const onEnableContractSupportRequest = () => new Promise(resolve => this.setState(
      {
        ledgerState: this.LEDGER_STATES.SWITCH_MODE
      },
      () => resolve()
    ))

    const ledgerEthereum = new LedgerEthereum(
      Network.Main,
      BrowserLedgerConnectionFactory,
      onConnectLedgerRequest,
      onOpenEthereumAppRequest,
      onSwitchLedgerModeRequest,
      onEnableContractSupportRequest
    )

    console.log('ledgerEthereum -- ', ledgerEthereum)

    // const address = ledgerEthereum.getAddressByBip44Index(0).then(res => console.log('address -- ', res))

    // console.log('address -- ', address)
  }

  render() {
    const s = this.state

    console.log('state -- ', s)

    return (
      <span>Ledger</span>
    )
  }
}
