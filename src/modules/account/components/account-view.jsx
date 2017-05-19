import React, { Component, PropTypes } from 'react';
// import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
// import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import Input from 'modules/common/components/input';
import Link from 'modules/link/components/link';
import ComponentNav from 'modules/common/components/component-nav';
import Identicon from 'react-blockies';

import { ACCOUNT_NAV_ITEMS } from 'modules/account/constants/account-nav-items';
import { ACCOUNT_DEPOSIT, ACCOUNT_CONVERT, ACCOUNT_WITHDRAW } from 'modules/app/constants/views';

import AccountDetails from 'modules/account/components/account-details';
import AccountDeposit from 'modules/account/components/account-deposit';
import AccountConvert from 'modules/account/components/account-convert';
import AccountWithdraw from 'modules/account/components/account-withdraw';

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
    // TODO
    // Details <
    // Deposit
    // Convert
    // Withdraw

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
            <AccountConvert />
          }
          {s.selectedNav === ACCOUNT_WITHDRAW &&
            <AccountWithdraw />
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
