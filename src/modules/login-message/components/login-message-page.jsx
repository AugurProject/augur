/*
 * Author: priecint
 */

import React, { PropTypes } from 'react';
import Link from '../../link/components/link';

const LoginMessagePage = (p) => (
	<main className="page login-message">
		<div className="page-content">
			<div className="l-container">
				<h1>Welcome to Augur's beta test v2!</h1>
				<p>This is a beta test in advance of Augur's live release. There are bugs. There are features being
					added, improved, and re-designed. There are a few hundred enhancements scheduled to be added in the next few
					months. Your thoughtful feedback now is essential. Please use the feedback button at the bottom right of
					every page to submit your feedback, or feel free to send an email to <a className="link" href="mailto:hugs@augur.net?subject=Beta Testing feedback">hugs@augur.net</a>.
					From your submissions, the development team will coordinate fixes and new features. Changes and fixes will be
					displayed when you log in again.
				</p>
				<h2>Important Information:</h2>
				<ol>
					<li>
						Because Augur is a <b>completely decentralized</b> system, if you lose your login credentials it
						is impossible to recover them. Please <a className="link" href="http://blog.augur.net/faq/how-do-i-savebackup-my-wallet/" target="_blank">take
						appropriate measures</a> to protect the safety of your password, and create a way to
						recover your credentials if you forget them.
					</li>
					<li>
						Do not send real Ether (ETH) to your Augur account while we are testing! Each account will be given
						10,000 testnet ETH tokens for beta testing. Please note that testnet ETH has no value except for testing:
						it is merely an on-contract IOU (a token) for testnet Ether.
					</li>
					<li>
						Reputation (REP) is a unique and important part of the Augur trading platform. If you own REP tokens, you must visit
						the site periodically to fulfill your reporting obligations. During beta testing, each new account will
						receive 47 testnet REP (they have no value except for testing). Each reporting cycle will last 2 days. Every
						two-day cycle will consist of a commit phase, a reveal phase, and a challenge phase. Because the test
						cycle is dramatically compressed (the main net cycle will be 60 days long) it is recommended that
						users visit the site at least every 2 days to maintain your REP and simulate “real money” trading,
						resolution, and reporting conditions. Learn <a className="link" href="https://www.youtube.com/watch?v=sCms-snzHk4" target="_blank">how Augur's Reputation tokens
						work</a>.
					</li>
					<li>
						The site is only as fast as Ethereum blocks are mined. However, it is important to know that all orders
						are placed into order books according to best price, and in the order in which they are received. This
						preserves price/time priority in Augur's markets.
					</li>
				</ol>
				<h2>Status:</h2>
				<p>The following issues have been refined as of Sep 1, 2016:</p>
				1/
				2/
				3/
				<p>The following issues have been refined as of Aug 26, 2016</p>
				1/
				2/
				3/
				<br />
				<Link className="lets-do-this-button" {...p.siteHeader.marketsLink} >Let's do this!</Link>
			</div>
		</div>
	</main>
);

LoginMessagePage.propTypes = {
	siteHeader: PropTypes.object.isRequired
};

export default LoginMessagePage;
