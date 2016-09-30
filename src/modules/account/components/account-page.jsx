import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import Link from '../../link/components/link';
import Input from '../../common/components/input';

export default class AccountPage extends Component {
	static propTypes = {
		loginMessageLink: PropTypes.object.isRequired,
		account: PropTypes.object,
		siteHeader: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.handleTransfer = this.handleTransfer.bind(this);
		this.loginIDCopy = this.loginIDCopy.bind(this);
		this.state = {
			name: this.props.account.name,
			editName: false,
			showFullID: false,
			msg: ''
		};
	}

	handleTransfer = (e) => {
		e.preventDefault();
		const amount = this.refs.sendAmount.value;
		const currency = this.refs.currency.value;
		const recipient = this.refs.recipientAddress.value;

		this.refs.sendAmount.value = '';
		this.refs.currency.value = '';
		this.refs.recipientAddress.value = '';
		this.props.account.transferFunds(amount, currency, recipient);
	}

	loginIDCopy = (e) => {
		const loginIDDisplay = this.refs.loginIDDisplay;

		try {
			loginIDDisplay.select();
			document.execCommand('copy');
		} catch (err) {
			console.log(err);
		}
	}

	render() {
		const p = this.props;
		const s = this.state;

		return (
			<main className="page account">
				<SiteHeader {...p.siteHeader} />
				<header className="page-header">
					<span className="big-line">My Account</span>
					<Link className="button sign-out" {...p.siteHeader.authLink}>
						Sign Out
					</Link>
				</header>

				<section className="page-content">
					<div className="l-container">
						<div className="account-section">
							<h2 className="heading">Credentials</h2>
							<table className="account-info">
								<tbody>
									<tr className={classnames('account-info-item', { displayNone: p.account.localNode })}>
										<th className="title">Account Name:</th>
										<td className="item">
											{s.editName &&
												<Input
													type="text"
													value={p.account.name}
													onChange={(value) => this.setState({ name: value })}
												/>
											}
											{!s.editName &&
												<span title="Click here to add a name to your account.">
													{p.account.name || 'Click here to add a name.'}
												</span>
											}
											{!s.editName &&
												<button
													className="link" onClick={() => this.setState({ editName: true })}
													title="Click here to change your Account Name"
												>
													(change name)
												</button>
											}
											{s.editName &&
												<button
													className="button"
													onClick={() => this.setState({ name: '', editName: false })}
													title="Cancel without saving new name"
												>
													cancel
												</button>
											}
											{s.editName &&
												<button
													className="button make"
													onClick={() => {
														p.account.editName(s.name);
														this.setState({ name: '', editName: false });
													}}
													title="Save new account name"
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
												{p.account.id && p.account.id.indexOf('0x') === 0 && p.account.id.replace('0x', '')}
											</span>
										</td>
									</tr>

									<tr className={classnames('account-info-item', { displayNone: p.account.localNode })}>
										<th className="title">Login ID:</th>
										<td className="item">
											{!s.showFullID &&
												<span>
													{p.account.prettyLoginID}
												</span>
											}
											{s.showFullID &&
												<textarea ref="loginIDDisplay" className="display-full-login-id" title="Click here to copy your Login ID." value={p.account.loginID} readOnly onClick={this.loginIDCopy} />
											}
											<button
												className="link"
												title={s.showFullID ? 'Hide full id' : 'Show full id'}
												onClick={() => {
													const showHide = !s.showFullID;
													this.setState({ showFullID: showHide });
												}}
											>
												{s.showFullID ? '(hide id)' : '(show full id)'}
											</button>
											{s.showFullID &&
												<button className="button" title="Click here to copy your Login ID." onClick={this.loginIDCopy}>Copy Login ID</button>
											}
										</td>
									</tr>
                  { p.onAirbitzManageAccount &&
                    <tr className={classnames('account-info-item', { displayNone: p.account.localNode })}>
                      <td colSpan="2">
                        <button className="button" onClick={p.onAirbitzManageAccount}>
                          Manage Authentication
                        </button>
                      </td>
                    </tr>
                  }
								</tbody>
							</table>
						</div>
						<div className={classnames('account-section')}>
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
										className={classnames('auth-input')}
										min="0.0"
										ref="sendAmount"
										name="sendAmount"
										placeholder="Amount to transfer"
										title="Amount to transfer"
									/>
									<select ref="currency" className={classnames('currency-selector')} title="Currency Type">
										<option value="eth">ether (eth)</option>
										<option value="realEth">Real Ether (eth)</option>
										<option value="REP">REP (REP)</option>
									</select>
									<span>To:</span>
									<input
										type="text"
										className={classnames('auth-input')}
										ref="recipientAddress"
										name="recipientAddress"
										placeholder="Recipient Address"
										title="Recipient Address"
									/>
									<button
										className="button make"
										title="Click to Send Currency"
										onClick={this.handleTransfer}
									>
										Send Currency
									</button>
								</div>
							</div>
						</div>
						<div className={classnames('account-section', { displayNone: p.account.localNode })}>
							<div className="account-info-item">
								<h2 className="heading">Download Account</h2>
								<p>
									Download your account data. You should always save a backup of your account data somewhere safe! (Note: running a local Ethereum node? If you download your account data to your keystore folder, you can use your Augur account on your local node.)
								</p>
								<a
									className="button download-account"
									href={p.account.downloadAccountDataString}
									download={p.account.downloadAccountFileName}
									title="Click here to Download your Account."
								>
									Download Account
								</a>
							</div>
						</div>
						<div className={classnames('account-section')}>
							<div className="account-info-item">
								<h2 className="heading">Important Information</h2>
								<p>
									Read <Link {...p.loginMessageLink}>
										important information
									</Link> about Augur
								</p>
							</div>
						</div>
					</div>
				</section>
				<SiteFooter />
			</main>
		);
	}
}
