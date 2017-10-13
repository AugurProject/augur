import React from 'react'
import QRCode from 'qrcode.react'

import { Withdraw as WithdrawIcon, Copy as CopyIcon } from 'modules/common/components/icons/icons'

import Styles from 'modules/new-account/components/account-withdraw/account-withdraw.styles'

const AccountWithdraw = p => (
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
        <a href="#">Use Shapeshift</a>
      </div>
      <div className={Styles.AccountWithdraw__qrZone}>
        <QRCode
          value={p.address}
          size={124}
        />
      </div>
      <div className={Styles.AccountWithdraw__address}>
        <span className={Styles.AccountWithdraw__addressLabel}>
          Public Account Address
        </span>
        <span>
          {p.address}
          {CopyIcon}
        </span>
      </div>
    </div>
  </section>
)

export default AccountWithdraw
