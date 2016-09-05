/*
 * Author: priecint
 */

import React, { PropTypes } from 'react';
import SiteHeader from '../../site/components/site-header';
import SiteFooter from '../../site/components/site-footer';

const LoginMessagePage = (p) => (
	<main className="page login-message">
		<SiteHeader {...p.siteHeader} />

		<div className="page-content">
			<div className="l-container">
				<h1>Welcome to Augur; Beta Test V2. Please note this important information:</h1>
				<p>This is a BETA TEST in advance of the Augur Project’s V1 launch. There are bugs. There are
					features being
					added, improved, and re-designed. There are a few hundred enhancements scheduled to be added in
					the next few
					months.
					Your thoughtful feedback now is essential. Please use the feedback button at the bottom right of
					every page
					to submit your feedback, or feel free to send an email to: <a className="link" href="mailto:hugs@augur.net?subject=Beta Testing feedback">hugs@augur.net</a>
					From your submissions, the Dev team will coordinate fixes and new features. Changes and fixes
					will be
					displayed when you log-in again.
				</p>
				<h2>Important Information:</h2>
				<ol>
					<li>
						Because Augur is a completely DECENTRALIZED system, if you lose your Log-In credentials it
						is impossible
						to recover them. Please <a className="link" href="http://blog.augur.net/faq/how-do-i-savebackup-my-wallet/">take
						appropriate measures</a> to protect the safety of your password,
						and create a
						way to recover your credentials if you forget them.
					</li>
					<li>
						Do not send real ETH to your Augur account while we are testing. Each account will be given
						10,000
						"TEST" ETH for beta testing (TEST ETH has no value except for testing).
					</li>
					<li>
						REP is a unique and important part of the Augur trading platform. If you own REP tokens, you
						must visit
						the site periodically to fulfill your reporting obligations.
						During Beta Testing, each new account will receive 47 "TEST" REP (they have no value except
						for
						testing). Each reporting cycle will last 2 days. Every two-day cycle will consist of a
						commit phase, a
						reveal phase, and a challenge phase. Because the test cycle is dramatically compressed (the
						mainnet
						cycle will be 60 days long) it is recommended that users visit the site at least every 2
						days to
						maintain your REP and simulate “real money” trading, resolution, and reporting conditions.
						Learn <a className="link" href="https://www.youtube.com/watch?v=sCms-snzHk4">How Augur's Reputation Tokens
						Work</a>
					</li>
					<li>
						The site is only as fast as Ethereum blocks are mined. However, it is important to know that
						all orders
						are placed into order books according to best price, and in the order in which they are
						received. This
						is called “Price/Time Priority”.
					</li>
				</ol>
				<h2>Beta Test System Status:</h2>
				<p>The following issues have been refined as of Sep 1, 2016:</p>
				1/
				2/
				3/
				<p>The following issues have been refined as of Aug 26, 2016</p>
				1/
				2/
				3/
			</div>
		</div>

		<SiteFooter />
	</main>
);

LoginMessagePage.propTypes = {
	siteHeader: PropTypes.object.isRequired
};

export default LoginMessagePage;
