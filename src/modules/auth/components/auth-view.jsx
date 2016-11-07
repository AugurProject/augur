import React, { PropTypes } from 'react';
import classnames from 'classnames';
import AuthForm from 'modules/auth/components/auth-form';
import Link from 'modules/link/components/link';

class AuthPage extends React.Component {
	componentDidMount() {
		this.props.authForm.airbitzOnLoad.onLoad();
	}

	render() {
		const p = this.props;
		return (
			<section id="auth_view">
				<header className="page-header">
					<span className="big-line">Augur is a completely decentralized system</span> including user accounts.
					Your credentials never leave the browser, and you are responsible for keeping them safe.
					<br />
					<b>
						<i className="negative">
							It is impossible to recover your account if your credentials get lost!
						</i>
					</b><br />
					Click&nbsp;
					<Link
						className={classnames('airbitz-button')}
						onClick={p.authForm.airbitzLink.onClick}
					>
						{p.authForm.airbitzLinkText}
					</Link>
					&nbsp;to create an encrypted and backed up account using a simple username and password.
				</header>
				<AuthForm className="auth-form" {...p.authForm} />
			</section>
		);
	}
}

AuthPage.propTypes = {
	className: PropTypes.string,
	authForm: PropTypes.object
};

export default AuthPage;
