import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'

import ComponentNav from 'modules/common/components/component-nav'

import { ACCOUNT_NAV_ITEMS } from 'modules/account/constants/account-nav-items'
import { ACCOUNT_DEPOSIT, ACCOUNT_TRANSFER, ACCOUNT_EXPORT } from 'modules/app/constants/views'

import AccountDetails from 'modules/account/components/account-details'
import AccountDeposit from 'modules/account/components/account-deposit'
import AccountTransfer from 'modules/account/components/account-transfer'
import AccountExport from 'modules/account/components/account-export'

export default class AccountView extends Component {
  static propTypes = {
    loginAccount: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
    updateAccountName: PropTypes.func.isRequired,
    isMobile: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props)

    this.state = {
      selectedNav: ACCOUNT_DEPOSIT
    }

    this.updateSelectedNav = this.updateSelectedNav.bind(this)
  }

  updateSelectedNav(selectedNav) {
    this.setState({ selectedNav })
  }

  render() {
    const p = this.props
    const s = this.state

    const loginAccount = p.loginAccount

    return (
      <section id="account_view">
        <Helmet>
          <title>Account</title>
        </Helmet>

        {loginAccount.address &&
          <article
            className="account-content"
          >
            <AccountDetails
              name={loginAccount.accountName}
              updateAccountName={p.updateAccountName}
              address={loginAccount.address}
              trimmedAddress={loginAccount.trimmedAddress}
              signOut={p.signOut}
              airbitzAccount={loginAccount.airbitzAccount}
              manageAirbitzAccount={p.manageAirbitzAccount}
            />
            <ComponentNav
              fullWidth
              navItems={ACCOUNT_NAV_ITEMS}
              selectedNav={s.selectedNav}
              updateSelectedNav={this.updateSelectedNav}
            />
            {s.selectedNav === ACCOUNT_DEPOSIT &&
            <AccountDeposit
              address={loginAccount.address}
              isMobile={p.isMobile}
            />
            }
            {s.selectedNav === ACCOUNT_TRANSFER &&
            <AccountTransfer
              ethTokens={loginAccount.ethTokens}
              eth={loginAccount.eth}
              rep={loginAccount.rep}
              transferFunds={p.transferFunds}
            />
            }
            {s.selectedNav === ACCOUNT_EXPORT &&
            <AccountExport
              airbitzAccount={loginAccount.airbitzAccount}
              stringifiedKeystore={loginAccount.stringifiedKeystore}
              privateKey={loginAccount.accountPrivateKey}
              downloadAccountDataString={loginAccount.downloadAccountDataString}
              downloadAccountFileName={loginAccount.downloadAccountFileName}
              isMobile={p.isMobile}
            />
            }
          </article>
        }
      </section>
    )
  }
}
