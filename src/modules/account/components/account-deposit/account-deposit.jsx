import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import Clipboard from 'clipboard'

import { Deposit as DepositIcon, Copy as CopyIcon } from 'modules/common/components/icons/icons'

import Styles from 'modules/account/components/account-deposit/account-deposit.styles'

export default class AccountDeposit extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired
  }

  componentDidMount() {
    const clipboard = new Clipboard('#copy_address') // eslint-disable-line
  }

  render() {
    const p = this.props

    return (
      <section className={Styles.AccountDeposit}>
        <div className={Styles.AccountDeposit__heading}>
          <h1>Account: Deposit</h1>
          { DepositIcon }
        </div>
        <div className={Styles.AccountDeposit__main}>
          <div className={Styles.AccountDeposit__description}>
            <p>
              DO NOT send real ETH or REP to this account. Augur is currently on Ethereum&#39;s Rinkeby testnet.
            </p>
            <a href="https://shapeshift.io">Use Shapeshift</a>
          </div>
          <div className={Styles.AccountDeposit__qrZone}>
            <QRCode
              value={p.address}
              size={124}
            />
          </div>
          <div className={Styles.AccountDeposit__address}>
            <button
              id="copy_address"
              className={Styles.AccountDeposit__copyButtonElement}
              data-clipboard-text={p.address}
            >
              <span className={Styles.AccountDeposit__addressLabel}>
                Public Account Address
              </span>
              <span className={Styles.AccountDeposit__addressString}>
                {p.address}
              </span>
              {CopyIcon}
            </button>
          </div>
        </div>
      </section>
    )
  }
}
