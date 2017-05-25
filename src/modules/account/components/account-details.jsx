import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Identicon from 'react-blockies';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import Link from 'modules/link/components/link';
import Input from 'modules/common/components/input';
import AirbitzLogoIcon from 'modules/common/components/airbitz-logo-icon';

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

export default class AccountDetails extends Component {
  static propTypes = {
    address: PropTypes.string.isRequired,
    trimmedAddress: PropTypes.string.isRequired,
    signOut: PropTypes.object.isRequired,
    updateAccountName: PropTypes.func.isRequired,
    name: PropTypes.string,
    airbitzAccount: PropTypes.object,
    onAirbitzManageAccount: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      nameInputVisible: false,
      fullAccountVisible: false
    };

    this.toggleNameInputVisibility = this.toggleNameInputVisibility.bind(this);
    this.toggleFullAccountVisibility = this.toggleFullAccountVisibility.bind(this);
  }

  toggleNameInputVisibility() {
    this.setState({ nameInputVisible: !this.state.nameInputVisible });
  }

  toggleFullAccountVisibility() {
    this.setState({ fullAccountVisible: !this.state.fullAccountVisible });
  }

  updateAccountName(name) {
    if (this.props.name !== name) this.props.updateAccountName(name);
  }

  render() {
    const p = this.props;
    const s = this.state;

    const nameInputPlaceholder = 'Set Account Name';
    const animationSpeed = parseInt(window.getComputedStyle(document.body).getPropertyValue('--animation-speed-very-fast'), 10);

    return (
      <article className="account-details">
        <div
          className="account-details-core"
        >
          <div
            className="identicon-container"
          >
            <Identicon
              seed={p.address}
              scale={8}
            />
            {p.airbitzAccount &&
              <div
                className="airbitz-logo-container"
              >
                <AirbitzLogoIcon />
              </div>
            }
          </div>
          <div
            className="account-details-core-values"
          >
            <div className="account-details-name">
              <CSSTransitionGroup
                transitionName="name-input"
                transitionEnterTimeout={animationSpeed}
                transitionLeaveTimeout={animationSpeed}
              >
                {s.nameInputVisible &&
                  <Input
                    autoFocus
                    className={classNames({ 'name-unset': !p.name })}
                    type="text"
                    value={p.name}
                    onChange={name => this.updateAccountName(name)}
                    onBlur={() => this.toggleNameInputVisibility()}
                    placeholder={nameInputPlaceholder}
                  />
                }
              </CSSTransitionGroup>
              <button
                className="unstyled"
                onClick={() => {
                  if (!s.nameInputVisible) this.toggleNameInputVisibility();
                }}
              >
                <span
                  className={classNames('account-details-name-copy', {
                    'name-unset': !p.name,
                    'input-visible': s.nameInputVisible
                  })}
                >
                  {p.name || nameInputPlaceholder}
                </span>
              </button>
            </div>
            <button
              className="unstyled account-details-address"
              onClick={() => this.toggleFullAccountVisibility()}
            >
              <CSSTransitionGroup
                component="div"
                className="account-details-address-values"
                transitionName="address"
                transitionEnterTimeout={animationSpeed}
                transitionLeaveTimeout={animationSpeed}
              >
                {s.fullAccountVisible &&
                  <span>{p.address}</span>
                }
                {!s.fullAccountVisible &&
                  <span>{p.trimmedAddress}</span>
                }
              </CSSTransitionGroup>
            </button>
          </div>
        </div>
        <Link {...p.signOut} >Sign Out</Link>
      </article>
    );
  }
}

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
