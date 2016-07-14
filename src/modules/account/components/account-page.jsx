import React, { PropTypes, Component } from 'react';

import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import Link from '../../link/components/link';
import Input from '../../common/components/input';

export default class AccountPage extends Component {
	static propTypes = {
		onChangePass: PropTypes.func,
		account: PropTypes.object,
		siteHeader: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.state = {
			name: this.props.account.name,
			editName: false,
			editPassword: false,
			showFullID: false,
			msg: ''
		};
	}

	handleSubmit = (e) => {
		e.preventDefault();
		// save values so that they will be used in the timeout.
		const password = this.refs.password && this.refs.password.value;
		const newPassword = this.refs.newPassword && this.refs.newPassword.value;
		const newPassword2 = this.refs.newPassword2 && this.refs.newPassword2.value;
		setTimeout(() =>
			this.props.onChangePass(
				password, newPassword, newPassword2, this.setState.bind(this)
			), 100);
	}

	render() {
		const p = this.props;
		const s = this.state;
		// console.log(p);
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
									<tr className="account-info-item">
										<th className="title">Account Name:</th>
										<td className="item">
											{s.editName &&
												<Input
													type="text"
													value={p.account.name}
													isClearable={false}
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
													className="link" onClick={() => { if (!s.editPassword) this.setState({ editName: true }); }}
													title="Click here to change your Account Name"
												>
													(change name)
												</button>
											}
											{s.editName &&
												<button
													className="button"
													onClick={() => { this.setState({ name: '', editName: false }); }}
													title="Cancel without saving new name"
												>
													cancel
												</button>
											}
											{s.editName &&
												<button
													className="button make"
													onClick={() => {
														if (!s.editPassword) {
															p.account.editName(s.name);
															this.setState({ name: '', editName: false });
														}
													}}
													title="Save new account name"
												>
													save change
												</button>
											}
										</td>
									</tr>

									<tr className="account-info-item">
										<th className="title">Secure Login ID:</th>
										<td className="item">
											{!s.showFullID &&
												<span>
													{p.account.prettySecureLoginID}
												</span>
											}
											{s.showFullID &&
												<textarea className="full-secure-login-id" value={p.account.secureLoginID} readOnly />
											}
											<button
												className="link"
												title={s.showFullID ? 'Hide full id' : 'Show full id'}
												onClick={() => {
													const showHide = !s.showFullID;
													if (!s.editPassword) this.setState({ showFullID: showHide });
												}}
											>
												{s.showFullID ? '(hide id)' : '(show full id)'}
											</button>
										</td>
									</tr>

									<tr className="account-info-item">
										<th className="title">Password:</th>
										{!s.editPassword &&
											<td className="item">
												<span>************</span>
												<button
													className="link"
													onClick={() => this.setState({ editPassword: true })}
													title="Click here to Change your Password."
												>
													(change password)
												</button>
												{s.msg !== '' &&
													<div className="password-msg">
														<span>
															{s.msg}
														</span>
														<span
															className="dismiss-message"
															title="Click to dismiss message"
															onClick={() => this.setState({ msg: '' })}
														>
														&#xf057;
														</span>
													</div>
												}
											</td>
										}


										{s.editPassword &&
											<td className="item password-change-container">
												<form onSubmit={this.handleSubmit}>
													<input
														className="input box"
														ref="password"
														type="password"
														maxLength="256"
														placeholder="current password"
														title="enter your current password here"
													/>
													<br />
													<input
														className="input box"
														ref="newPassword"
														type="password"
														maxLength="256"
														placeholder="new password"
														title="enter your desired new password here"
													/>
													<br />
													<input
														className="input box"
														ref="newPassword2"
														type="password"
														maxLength="256"
														placeholder="confirm new password"
														title="re-enter your new password for confirmation"
													/>
													<br />
													<button
														type="button"
														title="Cancel password change and keep your current Password."
														className="button"
														onClick={() => this.setState({ editPassword: false })}
													>
														cancel
													</button>
													<button
														className="button make"
														type="submit"
														title="Click here to save your new Password."
													>
														confirm password change
													</button>
												</form>
											</td>
										}

									</tr>
								</tbody>
							</table>
						</div>
						<div className="account-section">
							<div className={s.editPassword ? 'account-info-item fade' : 'account-info-item'}>
								<h2 className="heading">Download Account</h2>
								<p>
									If you are running Augur using a local geth node, you can download your account data to login through the node.
								</p>
								<button className="button download-account" title="Click here to Download your Account." >
									Download Account
								</button>
							</div>
						</div>
					</div>
				</section>
				<SiteFooter />
			</main>
		);
	}
}
