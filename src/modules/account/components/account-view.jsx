import React, { PropTypes } from 'react';
// import ReactTooltip from 'react-tooltip';
// import classnames from 'classnames';
// import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import Link from 'modules/link/components/link';

import AccountDetails from 'modules/account/components/account-details';

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

// TODO
// Details
// Deposit
// Convert
// Withdraw

const AccountView = (p) => {
  const loginAccount = p.loginAccount;

  return (
    <section id="account_view">
      <article
        className="account-content"
      >
        <div className="account-header">
          <h2>Account</h2>
          <Link {...p.authLink} >Sign Out</Link>
        </div>
      </article>
    </section>
  );
};

AccountView.propTypes = {
  loginAccount: PropTypes.object.isRequired
};

// static propTypes = {
//   loginAccount: PropTypes.object.isRequired,
//   authLink: PropTypes.object.isRequired
// }

export default AccountView;


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
