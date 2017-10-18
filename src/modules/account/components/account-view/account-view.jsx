import React from 'react'
import { Route } from 'react-router-dom'

import AccountHeader from 'modules/account/containers/account-header'
import AccountDeposit from 'modules/account/containers/account-deposit'
import AccountWithdraw from 'modules/account/containers/account-withdraw'
import AccountExport from 'modules/account/containers/account-export'

import makePath from 'modules/routes/helpers/make-path'

import { ACCOUNT, ACCOUNT_DEPOSIT, ACCOUNT_WITHDRAW, ACCOUNT_EXPORT } from 'modules/routes/constants/views'

import Styles from 'modules/account/components/account-view/account-view.styles'

const AccountView = p => (
  <section className={Styles.AccountView}>
    <AccountHeader />
    <Route path={makePath([ACCOUNT, ACCOUNT_DEPOSIT])} component={AccountDeposit} />
    <Route path={makePath([ACCOUNT, ACCOUNT_WITHDRAW])} component={AccountWithdraw} />
    <Route path={makePath([ACCOUNT, ACCOUNT_EXPORT])} component={AccountExport} />
  </section>
)

export default AccountView
