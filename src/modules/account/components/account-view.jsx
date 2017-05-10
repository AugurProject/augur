import React, { PropTypes } from 'react';
// import ReactTooltip from 'react-tooltip';
// import classnames from 'classnames';
// import { ModalContainer, ModalDialog } from 'react-modal-dialog';

import Link from 'modules/link/components/link';
// import Input from 'modules/common/components/input';
// import PasswordInputForm from 'modules/account/components/password-input-form';

const QRCode = require('qrcode.react');

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

const AccountView = p => (
  <section id="account_view">
    <div className="view-header">
      <div className="view-header-group">
        <h2>Account</h2>
      </div>
      <div className="view-header-group">
        <Link {...p.authLink} >Sign Out</Link>
      </div>
    </div>
    <span>DOOOOOD</span>
  </section>
);

AccountView.propTypes = {
  loginAccount: PropTypes.object.isRequired
};

// static propTypes = {
//   loginAccount: PropTypes.object.isRequired,
//   authLink: PropTypes.object.isRequired
// }

export default AccountView;
