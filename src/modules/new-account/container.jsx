import React from 'react'
import { Route, withRouter } from 'react-router-dom'

import AccountDeposit from 'modules/new-account/components/account-deposit/container'

import makePath from 'modules/routes/helpers/make-path'

import { ACCOUNT_DEPOSIT } from 'modules/routes/constants/views'

const AccountView = p => (
  <section>
    <Route path={makePath(ACCOUNT_DEPOSIT)} component={AccountDeposit} />
  </section>
)

export default withRouter(AccountView)
