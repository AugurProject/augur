import React, { PropTypes, Component } from 'react';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import Link from '../../link/components/link';
import AugurInput from '../../common/components/input';

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

		return (
			<main className="page account">
				<SiteHeader {...p.siteHeader} />

				<header className="page-header">
					<div className="l-container">
						<div className="sign-out-container">
							<Link className="button sign-out" title="Click here to Sign Out of your Account." {...p.siteHeader.authLink}>
								Sign Out
							</Link>
						</div>
					</div>
				</header>

				<section className="page-content">
					<div className="l-container">
						<div className="account-details">
							<h1>Account Information:</h1>
							<div className="account-info">
								<div className={s.editPassword ? 'account-info-item fade' : 'account-info-item'}>
									<h2>Account Name:</h2>
									{s.editName &&
										<AugurInput
											type="text"
											value={p.account.name}
											onChange={(value) => this.setState({ name: value })}
										/>
									}
									{!s.editName &&
										<div className="item" title="Click here to add a name to your account.">
											{p.account.name || 'Click here to add a name.'}
										</div>
									}
									{!s.editName &&
										<div
											className="text-button" o
											nClick={() => { if (!s.editPassword) this.setState({ editName: true }); }}
											title="Click here to change your Account Name"
										>
											Change Account Name
										</div>
									}
									{s.editName &&
										<button
											className="button make"
											href=""
											onClick={() => {
												if (!s.editPassword) {
													p.account.editName(s.name);
													this.setState({ name: '', editName: false });
												}
											}}
											title="Click here to save your new Account Name"
										>
											Save Change
										</button>
									}
								</div>

								<div className={s.editPassword ? 'account-info-item fade' : 'account-info-item'}>
									<h2>Secure Login ID:</h2>
									<div className="item">
										{s.showFullID ? p.account.id : p.account.prettySecureLoginID}
									</div>
									<div
										className="text-button"										onClick={() => {
											const showHide = !s.showFullID;
											if (!s.editPassword) this.setState({ showFullID: showHide });
										}}
										title={s.showFullID ? 'Click here to hide your Secure Login ID' : 'Click here to show your Secure Login ID'}
									>
										{s.showFullID ? 'Hide Secure Login ID' : 'Show Secure Login ID'}
									</div>
								</div>

								{!s.editPassword &&
									<div className={s.editPassword ? 'account-info-item fade' : 'account-info-item'}>
										<h2>Password:</h2>
										<div
											className="text-button"
											onClick={() => this.setState({ editPassword: true })}
											title="Click here to Change your Password."
										>
											Change Password
										</div>
									</div>
								}
								{!s.editPassword && (s.msg !== '') &&
									<div className="password-msg" onClick={() => this.setState({ msg: '' })} title="Click here to dismiss this message.">
										{s.msg}
									</div>
								}
								{s.editPassword &&
									<form className="change-password-container" onSubmit={this.handleSubmit}>
										<h2>Password:</h2>
										<div className="password-input">
											<label className="passLabel">Current Password:</label>
											<input
												className="input box"
												ref="password"
												type="password"
												maxLength="256"
												placeholder="Current Password"
												title="Enter your current Password here."
											/>
										</div>
										<div className="password-input">
											<label className="passLabel">Password:</label>
											<input
												className="input box"
												ref="newPassword"
												type="password"
												maxLength="256"
												placeholder="Password"
												title="Enter your desired new Password here."
											/>
										</div>
										<div className="password-input">
											<label className="passLabel">Confirm Password:</label>
											<input
												className="input box"
												ref="newPassword2"
												type="password"
												maxLength="256"
												placeholder="Confirm Password"
												title="Enter your desired new Password here again to confirm the new Password."
											/>
										</div>
										<div className="change-password-actions">
											<button
												className="button make"
												type="submit"
												title="Click here to save your new Password."
											>
												Confirm Password Change
											</button>
											<button type="button" className="button" onClick={() => this.setState({ editPassword: false })} title="Click here to cancel the Password change and keep your current Password.">
												Cancel Password Change
											</button>
										</div>
									</form>
								}

								<div className={s.editPassword ? 'account-info-item fade' : 'account-info-item'}>
									<h2>Download Account:</h2>
									<p>
										If you are running Augur using a local geth node, you can download your account data to login through the node.
									</p>
									<button className="button make" title="Click here to Download your Account." >
										Download Account
									</button>
								</div>

							</div>
						</div>
					</div>
				</section>
				<SiteFooter />
			</main>
		);
	}
}
