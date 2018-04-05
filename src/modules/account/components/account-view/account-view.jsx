import React from 'react'
import { Switch } from 'react-router-dom'

import AuthenticatedRoute from 'modules/routes/components/authenticated-route/authenticated-route'

import AccountHeader from 'modules/account/containers/account-header'
import AccountDeposit from 'modules/account/containers/account-deposit'
import AccountWithdraw from 'modules/account/containers/account-withdraw'
import AccountRepFaucet from 'modules/account/containers/account-rep-faucet'
import TermsAndConditions from 'modules/app/components/terms-and-conditions/terms-and-conditions'

import { augur } from 'services/augurjs'

import makePath from 'modules/routes/helpers/make-path'

import { ACCOUNT_DEPOSIT, ACCOUNT_WITHDRAW, ACCOUNT_REP_FAUCET } from 'modules/routes/constants/views'

import Styles from 'modules/account/components/account-view/account-view.styles'

const AccountView = (p) => {

  const showRepFaucet = parseInt(augur.rpc.getNetworkID(), 10) !== 1

  return (
    <section className={Styles.AccountView}>
      <div>
        <AccountHeader />
        <Switch>
          <AuthenticatedRoute path={makePath(ACCOUNT_DEPOSIT)} component={AccountDeposit} />
          <AuthenticatedRoute path={makePath(ACCOUNT_WITHDRAW)} component={AccountWithdraw} />
          {showRepFaucet &&
            <AuthenticatedRoute path={makePath(ACCOUNT_REP_FAUCET)} component={AccountRepFaucet} />
          }
        </Switch>
      </div>
      <TermsAndConditions />
    </section>
  )
}

export default AccountView
