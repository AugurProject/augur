import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import Link from '../../link/components/link';
import Input from '../../common/components/input';

export default class AccountPage extends Component {
	static propTypes = {
		account: PropTypes.object,
		siteHeader: PropTypes.object
	};

	constructor(props) {
		super(props);
		this.state = {
			name: this.props.account.name,
			editName: false,
			showFullID: false,
			showFullAddress: false,
			msg: ''
		};
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
											{!s.showFullAddress &&
												<span>
													{p.account.prettyAddress}
												</span>
											}
											{s.showFullAddress &&
												<textarea className="full-secure-login-id" value={p.account.id} readOnly />
											}
											<button
												className="link"
												title={s.showFullID ? 'Hide full address' : 'Show full address'}
												onClick={() => {
													const showHide = !s.showFullAddress;
													this.setState({ showFullAddress: showHide });
												}}
											>
												{s.showFullAddress ? '(hide address)' : '(show full address)'}
											</button>
										</td>
									</tr>

									<tr className={classnames('account-info-item', { displayNone: p.account.localNode })}>
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
													this.setState({ showFullID: showHide });
												}}
											>
												{s.showFullID ? '(hide id)' : '(show full id)'}
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className={classnames('account-section', { displayNone: p.account.localNode })}>
							<div className="account-info-item">
								<h2 className="heading">Download Account</h2>
								<p>
									If you are running Augur using a local geth node, you can download your account data to login through the node.
								</p>
								<button className="button download-account" title="Click here to Download your Account." onClick={() => p.account.downloadAccount()}>
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
