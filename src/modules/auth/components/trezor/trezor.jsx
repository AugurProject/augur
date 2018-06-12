import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { augur } from 'services/augurjs'

import Styles from 'modules/auth/components/trezor/trezor.styles'

export default class Trezor extends PureComponent {
  static propTypes = {
    loginWithTrezor: PropTypes.func.isRequired,
    showError: PropTypes.func.isRequired,
  }

  render() {
    const {
      loginWithTrezor,
      showError,
    } = this.props

    // const testnet = true // TODO update when testnet is not used
    // const network = testnet ? 1 : 60

    const connect = window.TrezorConnect // DEPENDS ON TREZOR CONNECT SCRIPT TAG IN INDEX.HTML

    return (
      <section className={Styles.TrezorConnect}>
        <div
          className={Styles.TrezorConnect__action}
        >
          <button
            className={Styles.TrezorConnect__button}
            onClick={() => {
              const isTestnet = augur.rpc.getNetworkID() !== '1'

              const path = `m/44'/${isTestnet ? '1' : '60'}'/0'/0/0` // First ETH account

              connect.ethereumGetAddress(path, (response) => {
                if (response.success) {
                  loginWithTrezor('0x' + response.address, connect, response.path) // Trezor uses hex with no prefix
                } else {
                  showError(response.error)
                }
              }, '1.4.2')
            }}
          >
            Connect Trezor
          </button>
        </div>
      </section>
    )
  }
}
