import React, { PropTypes } from 'react';
import AuthForm from '../../auth/components/auth-form';

const AuthPage = (p) => (
	<main className="page auth">
		<header className="page-header">
			<span className="big-line">Augur is a completely decentralized system</span> including user accounts.
			Your credentials never leave the browser, and you are responsible for keeping them safe.
			<br />
			<b>
				<i className="negative">
					It is impossible to recover your account if your credentials get lost!
				</i>
			</b>
		</header>
		<AuthForm className="auth-form" {...p.authForm} />
	</main>
);

AuthPage.propTypes = {
	className: PropTypes.string,
	authForm: PropTypes.object
};

export default AuthPage;
