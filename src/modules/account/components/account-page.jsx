import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import Link from '../../link/components/link';
import { AUTH_TYPES } from '../../auth/constants/auth-types';
import ValueDenomination from '../../common/components/value-denomination';
import Input from '../../common/components/input';

export default class AccountPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			handle: this.props.account.handle,
			editHandle: false,
			email: this.props.account.email,
			editEmail: false,
			showPrivateKey: false
		}
	}

	render() {
		const p = this.props;
		const s = this.state;
		console.log(p);
		console.log(s);

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
								<div className="account-info-item">
									<h2>Account ID:</h2>
									<div className="item">{p.account.id}</div>
								</div>

								<div className="account-info-item">
									<h2>Account Handle:</h2>
									{s.editHandle && <Input
										type="text"
										value={p.account.handle}
										onChange={(value) => this.setState({ handle: value })}
									/>}
									{!s.editHandle && <div className="item editable" onClick={() => this.setState({ editHandle: true })}>{p.account.handle || 'Click here to add a handle.'}</div>}
									{s.editHandle && <Link className="button make" href="" onClick={() => { p.account.editHandle(s.handle); this.setState({ handle: '', editHandle: false }); }} >
										Save Change
									</Link>}
								</div>

								<div className="account-info-item">
									<h2>Account Email:</h2>
									{s.editEmail && <Input
										type="text"
										value={p.account.email}
										onChange={(value) => this.setState({ email: value })}
									/>}
									{!s.editEmail && <div className="item editable" onClick={() => this.setState({ editEmail: true })}>{p.account.email || 'Click here to add a email.'}</div>}
									{s.editEmail && <Link className="button make" href="" onClick={() => { p.account.editEmail(s.email); this.setState({ email: '', editEmail: false }); }} >
										Save Change
									</Link>}
								</div>

								<div className="account-info-item">
									<h2>Private Key:</h2>
									<div className="item">
										{s.showPrivateKey ? p.account.privateKey.toString() : `********************************`}
									</div>
									<Link className="button make" href="" onClick={() => {
 										const showHide = s.showPrivateKey ? false : true; this.setState({ showPrivateKey: showHide }); }}>
										Reveal Private Key
									</Link>
								</div>

								<div className="account-info-item">
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

// <h1>Account Resources</h1>
// <div className="account-resources">
// 	<ValueDenomination
// 		{...p.account.rep || {}}
// 		formatted={p.account.rep && p.account.rep.formatted}
// 		formattedValue={p.account.rep && p.account.rep.formattedValue}
// 	/>
// 	<ValueDenomination
// 		{...p.account.ether || {}}
// 		formatted={p.account.ether && p.account.ether.formatted}
// 		formattedValue={p.account.ether && p.account.ether.formattedValue}
// 	/>
// </div>

// <header className="page-header">
// 	<div className="l-container">
// 		<div className="remember">
// 			<p>
// 				Remember: Augur is a completely decentralized system including user accounts. Your credentials never leave the browser, and you are responsible for keeping them safe.
// 			</p>
// 			<p>
// 				It is impossible to recover your account if your credentials get lost!
// 			</p>
// 		</div>
// 	</div>
// </header>
