import React, { Component, PropTypes } from 'react';
import ComponentNav from 'modules/common/components/component-nav';

import { ACCOUNT_NAV_ITEMS } from 'modules/account/constants/account-nav-items';
import { ACCOUNT_DEPOSIT, ACCOUNT_CONVERT, ACCOUNT_TRANSFER, ACCOUNT_EXPORT } from 'modules/app/constants/views';

import AccountDetails from 'modules/account/components/account-details';
import AccountDeposit from 'modules/account/components/account-deposit';
import AccountConvert from 'modules/account/components/account-convert';
import AccountTransfer from 'modules/account/components/account-transfer';
import AccountExport from 'modules/account/components/account-export';

// import Input from 'modules/common/components/input';
// import PasswordInputForm from 'modules/account/components/password-input-form';

// const QRCode = require('qrcode.react');

// constructor(props) {
//   super(props);
//
//   this.state = {
//     name: this.props.loginAccount.name,
//     editName: false,
//     showFullID: false,
//     msg: '',
//     sendAmount: '',
//     currency: 'ETH',
//     recipientAddress: '',
//     isShowingQRCodeModal: false,
//     isShowingPasswordInputModal: false
//   };
//
//   this.handleTransfer = this.handleTransfer.bind(this);
//   this.loginIDCopy = this.loginIDCopy.bind(this);
// }

export default class AccountView extends Component {
  static propTypes = {
    loginAccount: PropTypes.object.isRequired,
    authLink: PropTypes.object.isRequired,
    updateAccountName: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedNav: ACCOUNT_DEPOSIT
    };

    this.updateSelectedNav = this.updateSelectedNav.bind(this);
  }

  updateSelectedNav(selectedNav) {
    this.setState({ selectedNav });
  }

  render() {
    const p = this.props;
    const s = this.state;

    const loginAccount = p.loginAccount;

    return (
      <section id="account_view">
        <article
          className="account-content"
        >
          <AccountDetails
            name={loginAccount.name}
            updateAccountName={p.updateAccountName}
            address={loginAccount.address}
            trimmedAddress={loginAccount.trimmedAddress}
            signOut={p.authLink}
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
            />
          }
          {s.selectedNav === ACCOUNT_CONVERT &&
            <AccountConvert
              ethTokens={loginAccount.ether}
              eth={loginAccount.realEther}
              convertToToken={p.convertToToken}
              convertToEther={p.convertToEther}
            />
          }
          {s.selectedNav === ACCOUNT_TRANSFER &&
            <AccountTransfer
              ethTokens={loginAccount.ether}
              eth={loginAccount.realEther}
              rep={loginAccount.rep}
              transferFunds={p.transferFunds}
            />
          }
          {s.selectedNav === ACCOUNT_EXPORT &&
            <AccountExport
              airbitzAccount={loginAccount.airbitzAccount}
              downloadAccountDataString={loginAccount.downloadAccountDataString}
              downloadAccountFile={loginAccount.downloadAccountFile}
            />
          }
        </article>
      </section>
    );
  }
}

// static propTypes = {
//   loginAccount: PropTypes.object.isRequired,
//   authLink: PropTypes.object.isRequired
// }


// <div className="view-header">
//   <div className="view-header-group">
//     <h2>Account</h2>
//   </div>
//   <div className="view-header-group">
//     <Link {...p.authLink} >Sign Out</Link>
//   </div>
// </div>
// <div className="account-content">
//   {loginAccount.address && loginAccount.loginID &&
//     <AccountDetails
//       name={loginAccount.name}
//       address={loginAccount.address}
//       loginID={loginAccount.loginID}
//       trimmedLoginID={loginAccount.trimmedLoginID}
//     />
//   }
//   <AccountFundsManagement />
// </div>
