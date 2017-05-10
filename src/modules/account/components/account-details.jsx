import React, { PropTypes } from 'react';

// loginIDCopy = (e) => {
//   try {
//     this.refs.fullLoginID.select(); // TODO -- verify this in UI
//     document.execCommand('copy');
//   } catch (err) {
//     console.error(err);
//   }
// };

// handleModalOpenDeposit = () => {
//   this.setState({
//     isShowingQRCodeModal: true,
//     size: 300,
//     message: 'Ether / REP Deposit Address',
//     value: this.props.loginAccount.address && this.props.loginAccount.address.indexOf('0x') === 0 && this.props.loginAccount.address.replace('0x', '')
//   });
// };

const AccountDetails = p => (
  <article className="account-details">
    <span>Account Details</span>

      // <div className="account-section">
      //   <h2 className="heading">Credentials</h2>
      //   <table className="account-info">
      //     <tbody>
      //       <tr className={classnames('account-info-item', { displayNone: p.loginAccount.isUnlocked })}>
      //         <th className="title">Account Name:</th>
      //         <td className="item">
      //           {s.editName &&
      //             <Input
      //               type="text"
      //               value={p.loginAccount.name}
      //               onChange={name => this.setState({ name })}
      //             />
      //           }
      //           {!s.editName &&
      //             <span data-tip data-for="edit-name-tooltip">
      //               {p.loginAccount.name || 'Click here to add a name.'}
      //             </span>
      //           }
      //           {!s.editName &&
      //             <button
      //               data-tip data-for="change-name-tooltip"
      //               className="link" onClick={() => this.setState({ editName: true })}
      //             >
      //             (change name)
      //             </button>
      //           }
      //           {s.editName &&
      //             <button
      //               className="button"
      //               data-tip data-for="cancel-edit-name-tooltip"
      //               onClick={() => this.setState({ name: '', editName: false })}
      //             >
      //               cancel
      //             </button>
      //           }
      //           {s.editName &&
      //             <button
      //               className="button make"
      //               data-tip data-for="save-name-tooltip"
      //               onClick={() => {
      //                 p.loginAccount.editName(s.name);
      //                 this.setState({ name: '', editName: false });
      //               }}
      //             >
      //               save change
      //             </button>
      //           }
      //         </td>
      //       </tr>
      //
      //       <tr className="account-info-item">
      //         <th className="title">Account Address:</th>
      //         <td className="item">
      //           <span>
      //             {p.loginAccount.address && p.loginAccount.address.indexOf('0x') === 0 && p.loginAccount.address.replace('0x', '')}
      //           </span>
      //           <button
      //             className="link"
      //             onClick={this.handleModalOpenDeposit}
      //           >
      //             (QR code to despoit)
      //           {
      //             s.isShowingQRCodeModal &&
      //             <ModalContainer
      //               onClose={this.handleModalClose}
      //             >
      //               <ModalDialog
      //                 onClose={this.handleModalClose}
      //               >
      //                 <h1>
      //                   {s.message}
      //                 </h1>
      //                 <p>
      //                   <QRCode
      //                     size={s.size}
      //                     value={s.value}
      //                   />
      //                 </p>
      //               </ModalDialog>
      //             </ModalContainer>
      //           }
      //           </button>
      //         </td>
      //       </tr>
      //       <tr className={classnames('account-info-item', { displayNone: !p.loginAccount.loginID })}>
      //         <th className="title">Login ID:</th>
      //         <td className="item">
      //           {!s.showFullID &&
      //             <span>
      //               {p.loginAccount.prettyLoginID}
      //             </span>
      //           }
      //           {s.showFullID &&
      //             <textarea
      //               ref="fullLoginID"
      //               className="display-full-login-id"
      //               value={p.loginAccount.loginID}
      //               readOnly
      //               onClick={this.loginIDCopy}
      //             />
      //           }
      //           <button
      //             className="link"
      //             onClick={() => {
      //               this.setState({ showFullID: !s.showFullID });
      //             }}
      //           >
      //             {s.showFullID ? '(hide id)' : '(show full id)'}
      //           </button>
      //           {s.showFullID &&
      //             <button
      //               className="button"
      //               onClick={this.loginIDCopy}
      //             >
      //               Copy Login ID
      //             </button>
      //           }
      //         </td>
      //       </tr>
      //       {
      //         p.loginAccount.airbitzAccount ?
      //         (
      //           <tr className="account-info-item">
      //             <td colSpan="2">
      //               <button className="button" onClick={p.loginAccount.onAirbitzManageAccount}>
      //                 Manage Airbitz Account
      //               </button>
      //             </td>
      //           </tr>
      //         ) : null
      //       }
      //     </tbody>
      //   </table>
      // </div>
  </article>
);

AccountDetails.propTypes = {
  // TODO
};

export default AccountDetails;
