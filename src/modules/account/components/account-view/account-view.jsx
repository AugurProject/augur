import React from 'react'
import { Switch } from 'react-router-dom'

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route'

import AccountHeader from 'modules/account/containers/account-header'
import AccountDeposit from 'modules/account/containers/account-deposit'
import AccountWithdraw from 'modules/account/containers/account-withdraw'
import AccountExport from 'modules/account/containers/account-export'
import TermsAndConditions from 'modules/app/components/terms-and-conditions/terms-and-conditions'

import makePath from 'modules/routes/helpers/make-path'

import { ACCOUNT_DEPOSIT, ACCOUNT_WITHDRAW, ACCOUNT_EXPORT } from 'modules/routes/constants/views'

import Styles from 'modules/account/components/account-view/account-view.styles'

const AccountView = p => (
  <section className={Styles.AccountView}>
    <AccountHeader />
    <div className={Styles.AccountView__content} >
      <Switch>
        <AuthenticatedRoute path={makePath(ACCOUNT_DEPOSIT)} component={AccountDeposit} />
        <AuthenticatedRoute path={makePath(ACCOUNT_WITHDRAW)} component={AccountWithdraw} />
        <AuthenticatedRoute path={makePath(ACCOUNT_EXPORT)} component={AccountExport} />
      </Switch>
    </div>
    <TermsAndConditions />
  </section>
)

export default AccountView
