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
			showFullID: false
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
				password, newPassword, newPassword2
			), 100);
		// change state to remove the password changing form.
		this.setState({ editPassword: false });
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
							<Link className="button sign-out" {...p.siteHeader.authLink}>
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
									{s.editName && <AugurInput
										type="text"
										value={p.account.name}
										onChange={(value) => this.setState({ name: value })}
									/>}
									{!s.editName && <div className="item editable" onClick={() => { if (!s.editPassword) this.setState({ editName: true }); }}>{p.account.name || 'Click here to add a name.'}</div>}
									{s.editName &&
										<Link
											className="button make"
											href=""
											onClick={() => {
												if (!s.editPassword) {
													p.account.editName(s.name);
													this.setState({ name: '', editName: false });
												}
											}}
										>
											Save Change
										</Link>}
								</div>

								<div className={s.editPassword ? 'account-info-item fade' : 'account-info-item'}>
									<h2>Secure Login ID:</h2>
									<div className="item">
										{s.showFullID ? p.account.id : p.account.prettySecureLoginID}
									</div>
									<Link
										className="button make"
										href=""
										onClick={() => {
											const showHide = !s.showFullID;
											if (!s.editPassword) this.setState({ showFullID: showHide });
										}}
									>
										{s.showFullID ? 'Hide Secure Login ID' : 'Show Secure Login ID'}
									</Link>
								</div>

								{!s.editPassword && <div className={s.editPassword ? 'account-info-item fade' : 'account-info-item'}>
									<h2>Password:</h2>
									<div className="item">************</div>
									<Link className="button make" href="" onClick={() => this.setState({ editPassword: true })}>
										Change Password
									</Link>
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
												placeholder="current password"
											/>
										</div>
										<div className="password-input">
											<label className="passLabel">Password:</label>
											<input
												className="input box"
												ref="newPassword"
												type="password"
												maxLength="256"
												placeholder="password"
											/>
										</div>
										<div className="password-input">
											<label className="passLabel">Confirm Password:</label>
											<input
												className="input box"
												ref="newPassword2"
												type="password"
												maxLength="256"
												placeholder="confirm password"
											/>
										</div>
										<div className="change-password-actions">
											<input
												className="button make"
												type="submit"
												value="Confirm Password Change"
											/>
											<Link className="button" href="" onClick={() => this.setState({ editPassword: false })}>
												Cancel Password Change
											</Link>
										</div>
									</form>
								}

								<div className={s.editPassword ? 'account-info-item fade' : 'account-info-item'}>
									<h2>Export Account:</h2>
									<p>
										Augur is a decentralized app that stores a lot of its data right in your browser. To load your account on another device or browser, you will need to export it from one device and import it into another.
									</p>
									<Link className="button make" href="">
										Export Account
									</Link>
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
