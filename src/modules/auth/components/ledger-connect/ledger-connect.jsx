import React, { Component } from 'react'
import { LedgerEthereum, BrowserLedgerConnectionFactory, Network } from 'ethereumjs-ledger'

export default class Ledger extends Component {
  constructor() {
    super()

    this.LEDGER_STATES = {
      CONNECT_LEDGER: 'CONNECT_LEDGER',
      OPEN_APP: 'OPEN_APP',
      SWITCH_MODE: 'SWITCH_MODE'
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

    const ledgerEthereum = new LedgerEthereum(
      Network.Main,
      BrowserLedgerConnectionFactory,
      async () => {
        await new Promise((resolve) => {
          this.setState(
            { ledgerState: this.LEDGER_STATES.CONNECT_LEDGER },
            () => resolve()
          )
        })
      },
      async () => {
        await new Promise((resolve) => {
          this.setState(
            { ledgerState: this.LEDGER_STATES.OPEN_APP },
            () => resolve()
          )
        })
      },
      async () => {
        await new Promise((resolve) => {
          this.setState(
            { ledgerState: this.LEDGER_STATES.SWITCH_MODE },
            () => resolve()
          )
        })
      }
    )

    console.log('ledgerEthereum -- ', ledgerEthereum)
  }

  render() {
    const s = this.state

    console.log('state -- ', s)

    return (
      <span>Ledger</span>
    )
  }
}
