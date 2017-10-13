import React, { Component } from 'react'
import PropTypes from 'prop-types'
import QRCode from 'qrcode.react'
import Clipboard from 'clipboard'

import { Withdraw as WithdrawIcon, Copy as CopyIcon } from 'modules/common/components/icons/icons'

import Styles from 'modules/new-account/components/account-withdraw/account-withdraw.styles'

export default class AccountWithdraw extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired
  }

  componentDidMount() {
    const clipboard = new Clipboard('#copy_address') 
  }

  render() {
    const p = this.props

    return (
      <section className={Styles.AccountWithdraw}>
        <div className={Styles.AccountWithdraw__heading}>
          <h1>Account: Withdraw</h1>
          { WithdrawIcon }
        </div>
        <div className={Styles.AccountWithdraw__main}>
          <div className={Styles.AccountWithdraw__description}>
            <p>
              Withdraw Ethereum or Reputation from your connected Trading Account to another account.
            </p>
            <a href="https://shapeshift.io">Use Shapeshift</a>
          </div>
          <div className={Styles.AccountWithdraw__qrZone}>
            <QRCode
              value={p.address}
              size={124}
            />
          </div>
          <div className={Styles.AccountWithdraw__address}>
            <button
              id="copy_address"
              className={Styles.AccountWithdraw__copyButtonElement}
              data-clipboard-text={p.address}
            >
              <span className={Styles.AccountWithdraw__addressLabel}>
                Public Account Address
              </span>
              <span className={Styles.AccountWithdraw__addressString}>
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
