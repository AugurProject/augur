import React, { PropTypes } from 'react';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';
import AuthForm from '../../auth/components/auth-form';
import Link from '../../link/components/link';
import classnames from 'classnames';

const AuthPage = (p) => (
	<main className="page auth">
		<SiteHeader {...p.siteHeader} />
		<header className="page-header">
			<div className="l-container">
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
			</div>
		</header>
		<AuthForm className="auth-form" {...p.authForm} />
		<SiteFooter />
	</main>
);

AuthPage.propTypes = {
	className: PropTypes.string,
	siteHeader: PropTypes.object,
	authForm: PropTypes.object
};

export default AuthPage;
