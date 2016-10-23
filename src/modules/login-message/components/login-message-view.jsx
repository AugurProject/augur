import React, { PropTypes } from 'react';
import Link from '../../link/components/link';

const LoginMessagePage = p => (
	<main className="page login-message">
		<div className="page-content">
			<h1>{`Welcome to the Augur beta test!`}</h1>
			<p>{`This is a beta test in advance of Augur's live release. There are bugs. There are features being
				added, improved, and re-designed. There are a few hundred enhancements scheduled to be added in the next few
				months. Your thoughtful feedback now is essential. Please use the feedback button at the bottom right of
				every page to submit your feedback, or feel free to send an email to `}
				<a
					className="link"
					href="mailto:hugs@augur.net?subject=Beta Testing feedback"
				>
					{'hugs@augur.net'}
				</a>
				{`. From your submissions, the development team will coordinate fixes and new features. Changes and fixes will be
				displayed when you log in again.`}
			</p>
			<h2>Important information:</h2>
			<ol>
				<li>
					Because Augur is a <b>completely decentralized</b> system, if you lose your login credentials it
					is impossible to recover them. Please <a className="link" href="http://blog.augur.net/faq/how-do-i-savebackup-my-wallet/" target="_blank" rel="noopener noreferrer">take
					appropriate measures</a> to protect the safety of your password, and create a way to
					recover your credentials if you forget them.
				</li>
				<li>
					Do not send real Ether (ETH) to your Augur account while we are testing! Each account will be given
					10,000 testnet ETH tokens for beta testing. Please note that testnet ETH has no value except for testing:
					it is merely an on-contract IOU (a token) for testnet Ether.
				</li>
				<li>
					{`Reputation (REP) is a unique and important part of the Augur trading platform. If you own REP tokens, you must visit
					the site periodically to fulfill your reporting obligations. During beta testing, each new account will
					receive 47 testnet REP (they have no value except for testing). Each reporting cycle will last 2 days. Every
					two-day cycle will consist of a commit phase, a reveal phase, and a challenge phase. Because the test
					cycle is dramatically compressed (the main net cycle will be 60 days long) it is recommended that
					users visit the site at least every 2 days to maintain your REP and simulate “real money” trading,
					resolution, and reporting conditions. Learn `}
					<a
						className="link"
						href="https://www.youtube.com/watch?v=sCms-snzHk4"
						target="_blank"
						rel="noopener noreferrer"
					>
						{`how Augur's Reputation tokens work`}
					</a>.
				</li>
				<li>
					{`The site is only as fast as Ethereum blocks are mined. However, it is important to know that all orders
					are placed into order books according to best price, and in the order in which they are received. This
					preserves price/time priority in Augur's markets.`}
				</li>
			</ol>
			<h2>Technical updates:</h2>
			<p>Oct 23, 2016 @ 12:18AM PST [<a href="mailto:jack@augur.net">Jack</a>]:</p>
			<ol>
				<li>
					&quot;Close Out Position&quot; has been re-labeled &quot;Redeem X Complete Sets&quot;.
				</li>
			</ol>
			<br />
			<p>Oct 22, 2016 @ 2:09AM PST [<a href="mailto:jack@augur.net">Jack</a>]:</p>
			<ol>
				<li>
					&quot;Sell Complete Sets&quot; has been re-labeled to &quot;Close Out Position&quot; everywhere this concept is exposed to the user.  This is intended to avoid confusion for users attempting to close out a short position (which requires them, somewhat unintuitively, to sell a complete set).
				</li>
				<li>
					The label for the automatic sell complete sets checkbox on the Accounts page has been improved.
				</li>
				<li>
					Buy and sell complete sets are now explicitly accounted for in the positions and P/L calculations.  (Testers: feedback / suggestions on the sell complete sets stuff is especially valuable, as I am finding this to be a somewhat tricky UX problem!)
					<ol>
						<li>
							Shares acquired via buy complete sets (i.e., new shares issued) are included in the positions total.  However, since there is not a price for each outcome within the complete set, the shares from the complete set do <b>not</b> contribute to the mean price of open position.  (Note: this only applies to complete sets bought manually by the user.  Complete sets bought as part of short selling are not included in the positions total.)
						</li>
						<li>
							Complete sets sold to close out a <b>long</b> position are deducted from your total position.  Since there is not a price for each outcome within the complete set, selling the complete set does <b>not</b> change realized P/L.
						</li>
						<li>
							Motivating example: suppose you have short sold 2 shares of one outcome in a market.  The UI displays your position as -2 in that outcome, and 0 in the other outcomes.  To close out your short position, you buy 2 shares in the same outcome.  The UI now shows your position as 0 in all outcomes.  However, what has happened behind the scenes is, you were actually long the other outcomes (and 0 in the outcome you shorted), and when you bought back 2 shares, now you have 2 shares in all outcomes.  Therefore, to actually close out your position, you have to sell 2 complete sets.
							<br />
							Complete sets sold to close out a <b>short</b> position work as follows.  If you have a short position, shares bought back are added to your position, but they do not contribute to your realized P/L until you have actually sold the complete set(s) back.  Shares that have been bought back but not yet closed out (via sell complete sets) are &quot;queued&quot;, and the system calculates a &quot;queued P/L&quot; for these shares.  (Currently, queued P/L is simply added to unrealized P/L, but it may help clarify things for the user to show it explicitly in the positions display.)  Also, note that if you have manually bought any complete sets, your complete sets sold are first netted with the complete sets bought; only the excess complete sets sold are used to close out queued shares.
						</li>
					</ol>
				</li>
				<li>
					Open orders are now sorted in descending order, asks first.
				</li>
				<li>
					Fixed a bug that was preventing the Portfolio page from loading.
				</li>
			</ol>
			{p.marketsLink &&
				<Link className="lets-do-this-button" {...p.marketsLink} >{`Let's do this!`}</Link>
			}
		</div>
	</main>
);

LoginMessagePage.propTypes = {
	marketsLink: PropTypes.object // TODO
};

export default LoginMessagePage;
