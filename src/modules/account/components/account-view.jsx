import React, { PropTypes, Component } from 'react';
import ReactTooltip from 'react-tooltip';
import classNames from 'classnames';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';

import Link from 'modules/link/components/link';
import Input from 'modules/common/components/input';
import PasswordInputForm from 'modules/account/components/password-input-form';
import getValue from 'utils/get-value';

const QRCode = require('qrcode.react');

export default class AccountPage extends Component {
  // TODO -- Prop Validations
  static propTypes = {
    loginAccount: PropTypes.object,
    // siteHeader: PropTypes.object
    // authLink: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      name: this.props.loginAccount.name,
      editName: false,
      showFullID: false,
      msg: '',
      sendAmount: '',
      currency: 'ETH',
      recipientAddress: '',
      isShowingQRCodeModal: false,
      isShowingPasswordInputModal: false
    };

    this.handleTransfer = this.handleTransfer.bind(this);
    this.loginIDCopy = this.loginIDCopy.bind(this);
  }

  handleModalClose = () => {
    this.setState({
      isShowingQRCodeModal: false,
      isShowingPasswordInputModal: false
    });
  };

  handleModalOpenDeposit = () => {
    this.setState({
      isShowingQRCodeModal: true,
      size: 300,
      message: 'Ether / REP Deposit Address',
      value: this.props.loginAccount.address && this.props.loginAccount.address.indexOf('0x') === 0 && this.props.loginAccount.address.replace('0x', '')
    });
  };

  handleModalOpenTransfer = () => {
    this.setState({
      isShowingQRCodeModal: true,
      size: 300,
      message: 'Your Account Keystore Data',
      value: this.props.loginAccount.downloadAccountDataString
    });
  };

  handleTransfer = (e) => {
    e.preventDefault();

    const amount = this.state.sendAmount;
    const currency = this.state.currency;
    const recipient = this.state.recipientAddress;

    this.props.loginAccount.transferFunds(amount, currency, recipient);

    this.setState({
      sendAmount: '',
      currency: 'ETH',
      recipientAddress: ''
    });
  };

  loginIDCopy = (e) => {
    try {
      this.refs.fullLoginID.select(); // TODO -- verify this in UI
      document.execCommand('copy');
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    const p = this.props;
    const s = this.state;

    return (
      <section id="account_view">
        <article className="page-content">
          {p.authLink &&
            <Link {...p.authLink} >Sign Out (Temporarily Here)</Link>
          }
          <div className="account-section">
            <h2 className="heading">Credentials</h2>
            <table className="account-info">
              <tbody>
                <tr className={classNames('account-info-item', { displayNone: p.loginAccount.isUnlocked })}>
                  <th className="title">Account Name:</th>
                  <td className="item">
                    {s.editName &&
                      <Input
                        type="text"
                        value={p.loginAccount.name}
                        onChange={name => this.setState({ name })}
                      />
                    }
                    {!s.editName &&
                      <span data-tip data-for="edit-name-tooltip">
                        {p.loginAccount.name || 'Click here to add a name.'}
                      </span>
                    }
                    {!s.editName &&
                      <button
                        data-tip data-for="change-name-tooltip"
                        className="link" onClick={() => this.setState({ editName: true })}
                      >
                      (change name)
                      </button>
                    }
                    {s.editName &&
                      <button
                        className="button"
                        data-tip data-for="cancel-edit-name-tooltip"
                        onClick={() => this.setState({ name: '', editName: false })}
                      >
                        cancel
                      </button>
                    }
                    {s.editName &&
                      <button
                        className="button make"
                        data-tip data-for="save-name-tooltip"
                        onClick={() => {
                          p.loginAccount.editName(s.name);
                          this.setState({ name: '', editName: false });
                        }}
                      >
                        save change
                      </button>
                    }
                  </td>
                </tr>

                <tr className="account-info-item">
                  <th className="title">Account Address:</th>
                  <td className="item">
                    <span>
                      {p.loginAccount.address && p.loginAccount.address.indexOf('0x') === 0 && p.loginAccount.address.replace('0x', '')}
                    </span>
                    <button
                      className="link"
                      onClick={this.handleModalOpenDeposit}
                    >
                      (QR code to despoit)
                    {
                      s.isShowingQRCodeModal &&
                      <ModalContainer
                        onClose={this.handleModalClose}
                      >
                        <ModalDialog
                          onClose={this.handleModalClose}
                        >
                          <h1>
                            {s.message}
                          </h1>
                          <p>
                            <QRCode
                              size={s.size}
                              value={s.value}
                            />
                          </p>
                        </ModalDialog>
                      </ModalContainer>
                    }
                    </button>
                  </td>
                </tr>
                <tr className={classNames('account-info-item', { displayNone: !p.loginAccount.loginID })}>
                  <th className="title">Login ID:</th>
                  <td className="item">
                    {!s.showFullID &&
                      <span>
                        {p.loginAccount.prettyLoginID}
                      </span>
                    }
                    {s.showFullID &&
                      <textarea
                        ref="fullLoginID"
                        className="display-full-login-id"
                        value={p.loginAccount.loginID}
                        readOnly
                        onClick={this.loginIDCopy}
                      />
                    }
                    <button
                      className="link"
                      onClick={() => {
                        this.setState({ showFullID: !s.showFullID });
                      }}
                    >
                      {s.showFullID ? '(hide id)' : '(show full id)'}
                    </button>
                    {s.showFullID &&
                      <button
                        className="button"
                        onClick={this.loginIDCopy}
                      >
                        Copy Login ID
                      </button>
                    }
                  </td>
                </tr>
                {
                  p.loginAccount.airbitzAccount ?
                  (
                    <tr className="account-info-item">
                      <td colSpan="2">
                        <button className="button" onClick={p.loginAccount.onAirbitzManageAccount}>
                          Manage Airbitz Account
                        </button>
                      </td>
                    </tr>
                  ) : null
                }
              </tbody>
            </table>
          </div>
          <div className={classNames('account-section')}>
            <div className="account-info-item">
              <h2 className="heading">Deposit & Purchase Funds</h2>
              <p>
                You can deposit funds with ShapeShift using any alternative cryptocurrency, or purchase ETH directly with Coinbase. <b>(Disabled during beta)</b>
              </p>
              <div className="deposit-funds-section">
                <button
                  className="button intigrations"
                >
                  Deposit ETH with ShapeShift
                </button>
                <button
                  className="button intigrations"
                >
                  Deposit REP with ShapeShift
                </button>
                <button
                  className="button intigrations"
                >
                  Purchase ETH with Coinbase
                </button>
              </div>
            </div>
          </div>
          <div className={classNames('account-section')}>
            <div className="account-info-item">
              <h2 className="heading">Transfer Funds</h2>
              <p>
                You can transfer funds to another address by selecting the type of currency you would like to send and entering the address you would like to send it to. (Note: Always double check the address you intend to send funds to!)
              </p>
              <div className="transfer-funds-section">
                <span>Send:</span>
                <input
                  type="number"
                  step="0.1"
                  className={classNames('auth-input')}
                  min="0.0"
                  name="sendAmount"
                  placeholder="Amount to transfer"
                  data-tip data-for="amount-to-transfer-tooltip"
                  value={s.sendAmount}
                  onChange={sendAmount => this.setState({ sendAmount: sendAmount.target.value })}
                />
                <select
                  className="currency-selector"
                  data-tip data-for="select-currency-tooltip"
                  onChange={currency => this.setState({ currency: currency.target.value })}
                >
                  <option value="ETH">Ether (ETH)</option>
                  <option value="real ETH">Real Ether (ETH)</option>
                  <option value="REP">REP (REP)</option>
                </select>
                <span>To:</span>
                <input
                  type="text"
                  className={classNames('auth-input')}
                  name="recipientAddress"
                  placeholder="Recipient Address"
                  data-tip data-for="recipient-address-tooltip"
                  value={s.recipientAddress}
                  onChange={recipientAddress => this.setState({ recipientAddress: recipientAddress.target.value })}
                />
                <button
                  className="button make"
                  onClick={this.handleTransfer}
                >
                  Send Currency
                </button>
                <p>
                  You can withdraw to any cryptocurrency with ShapeShift. Open ShapeShift with the button below, select your input (ETH or REP) and output currency. Enter your destination address within the ShapeShift modal. Start the transaction, and enter the deposit address ShapeShift gives you into the withdraw field above. <b>(Disabled during beta)</b>
                </p>
                <button
                  className="button intigrations"
                >
                  Transfer funds with ShapeShift
                </button>
              </div>
            </div>
          </div>
          <div className={classNames('account-section', { displayNone: p.loginAccount.isUnlocked || !p.loginAccount })}>
            <div className="account-info-item">
              <h2 className="heading">Download Account Key File</h2>
              <p>
                Download your account key file. You should always save a backup of your account data somewhere safe! Remember, <b>Augur does not store any user account information and therefore has no ability to restore or recover lost accounts</b>. (Note: running a local Ethereum node? If you download your account data to your keystore folder, you can use your Augur account on your local node.)
              </p>
              <p id="warning">
                <b>
                  Do NOT share your downloaded account key file or QR code with anyone. Your funds *could* be stolen.
                </b>
              </p>
              <p>
                <b>
                  <a href="http://blog.augur.net/accidentally-sent-real-rep-eth-augur-beta/">
                    Did you accidentally send real REP or ETH to Augur beta? Learn how to get it back here!
                  </a>
                </b>
              </p>
              {p.loginAccount.airbitzAccount &&
                <span>
                  <button
                    className="download-account"
                    onClick={() => this.setState({ isShowingPasswordInputModal: !this.isShowingPasswordInputModal })}
                  >
                    Download Account Key File
                  </button>
                  <br />
                  {s.isShowingPasswordInputModal &&
                    <ModalContainer onClose={this.handleModalClose}>
                      <ModalDialog onClose={this.handleModalClose}>
                        <PasswordInputForm privateKey={getValue(p, 'loginAccount.privateKey')} />
                      </ModalDialog>
                    </ModalContainer>
                  }
                </span>
              }
              {!p.loginAccount.airbitzAccount &&
                <span>
                  <a
                    className="button download-account"
                    href={p.loginAccount.downloadAccountDataString}
                    download={p.loginAccount.downloadAccountFileName}
                  >
                    Download Account Key File
                  </a>
                  <div className="transferWallet">
                    <button
                      className="link"
                      onClick={this.handleModalOpenTransfer}
                    >
                      (QR code to transfer wallet)
                      {s.isShowingQRCodeModal &&
                        <ModalContainer onClose={this.handleModalClose}>
                          <ModalDialog onClose={this.handleModalClose}>
                            <h1>
                              {s.message}
                            </h1>
                            <p>
                              <QRCode
                                size={s.size}
                                value={s.value}
                              />
                            </p>
                          </ModalDialog>
                        </ModalContainer>
                      }
                    </button>
                  </div>
                </span>
              }
            </div>
          </div>
          <ReactTooltip id="edit-name-tooltip" type="light" effect="solid" place="top">
            <span className="tooltip-text">Click here to add a name to your account</span>
          </ReactTooltip>
          <ReactTooltip id="change-name-tooltip" type="light" effect="solid" place="top">
            <span className="tooltip-text">Click here to change your account name</span>
          </ReactTooltip>
          <ReactTooltip id="recipient-address-tooltip" type="light" effect="solid" place="top">
            <span className="tooltip-text">Recipient&#39;s Ethereum address</span>
          </ReactTooltip>
        </article>
      </section>
    );
  }
}
