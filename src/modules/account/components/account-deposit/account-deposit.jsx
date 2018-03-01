import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import Clipboard from 'clipboard'
import TextFit from 'react-textfit'

import { Deposit as DepositIcon, Copy as CopyIcon } from 'modules/common/components/icons'

import Styles from 'modules/account/components/account-deposit/account-deposit.styles'

export default class AccountDeposit extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
  }

  componentDidMount() {
    const clipboard = new Clipboard('#copy_address') // eslint-disable-line
  }

  render() {
    const p = this.props
    const styleQR = {
      height: 'auto',
      width: '100%',
    }

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
          <div className={Styles.AccountDeposit__address}>
            <h3 className={Styles.AccountDeposit__addressLabel}>
                Public Account Address
            </h3>
            <TextFit mode="single" max={18}>
              <button
                id="copy_address"
                className={Styles.AccountDeposit__copyButtonElement}
                data-clipboard-text={p.address}
              >
                <span className={Styles.AccountDeposit__addressString}>
                  {p.address}
                </span>
                {CopyIcon}
              </button>
            </TextFit>
          </div>
          <div>
            <QRCode
              value={p.address}
              style={styleQR}
            />
          </div>
        </div>
      </section>
    )
  }
}
