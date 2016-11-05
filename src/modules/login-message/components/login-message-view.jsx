import React, { PropTypes } from 'react';
import Link from '../../link/components/link';

const LoginMessagePage = p => (
	<main className="page login-message">
		<div className="page-content">
			<h1>{`Welcome to the Augur beta test!`}</h1>
			<p>{`This is a beta test in advance of Augur's live release. There are bugs. There are features being
				added, improved, and re-designed. There are a few hundred enhancements scheduled to be added in the next few
				months. Your thoughtful feedback now is essential. Please use the feedback button at the bottom left of
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
					{`A note on price/time priority on the blockchain.  The site is only as fast as Ethereum blocks are mined.  Augur's matching engine sorts order books by price, then by block number, then by transaction index. Within a single block, transactions are ordered by the miner who mines the block.  When constructing a block, miners typically order transactions first by gasprice (highest to lowest), and then by the order received (oldest to newest).  Instead of price/time priority, Augur uses "price/gasprice/time priority".  Presently, Augur does not attempt to adjust gasprices in response to other pending transactions, although, if desired, gasprice can be adjusted manually using the API, by changing the "gasPrice" field attached to every sendTransaction payload.`}
				</li>
			</ol>
			<h2>Technical updates:</h2>
			<h3>November 5, 2016</h3>
			<ol>
				<li>
					Fixed transaction failure (error 500) edge case that failed (nulled) without retrying the transaction, even if retryDroppedTxs was set to true.
				</li>
				<li>
					Added extra on-chain market ID lookup and loadMarketsInfo action for the case where a commit report action has been sent but the eventID field of the market selector has not yet been assigned.  As far as I can tell, the click-thru-to-next-report functionality is now working properly.
				</li>
				<li>
					Fixed scalar report outcome displays on transactions page.
				</li>
				<li>
					Added outcome names / IDs to transaction messages for commit report (submitReportHash) actions.
				</li>
				<li>
					Fixed initial trade-in-each-market setup for augur.js reporting-sequence tests.
				</li>
			</ol>
			<h3>November 4, 2016</h3>
			<ol>
				<li>
					Added check that market outcome data has loaded before using it to calculate P/L.
				</li>
				<li>
					Changed the tooltips in the market preview panel (in the main markets listing) to use click-to-show-and-hide tooltips, instead of hover-to-show, since hover is not available on mobile.  If these tooltips have the desired feel, the remainder of the tooltips can be converted to this form as well.  (There are only a few exceptions, in the case of elements that have both a tooltip and a click function.)
				</li>
				<li>
					Market titles in the main markets listing now link to the trade page.
				</li>
				<li>
					Clicking on tags in the market preview panel (in the main markets listing) now works correctly.
				</li>
				<li>
					Added Real ETH (i.e., testnet Ether) balance display to the sub-navbar.  Previously this was displayed as a popup when hovering over the transactions button on the main navbar, which did not make sense.  Real ETH is an important value for users to know and to distinguish from the play-money &quot;ETH&quot; used for trading (i.e., Ether IOU tokens which will be tradeable one-to-one for Ether when Augur is live, but which are simply play-money during beta).
				</li>
			</ol>
			<h3>November 3, 2016</h3>
			<ol>
				<li>
					Added <a href="https://github.com/wwayne/react-tooltip" className="link" target="_blank" rel="noopener noreferrer">react-tooltip</a> module, and converted all &quot;title&quot; fields in the UI to instead use proper tooltips.  (Values in title fields are not viewable on mobile.)
				</li>
				<li>
					Only add market description tooltips to the transactions display if a market description is truncated (to 100 characters).
				</li>
				<li>
					Changed currency abbreviations on the Account page to match those used elsewhere in the UI (REP for Reputation, real ETH for real Ether, and ETH for Ether).
				</li>
				<li>
					Changed the units for reporting cycle length display (was seconds).
				</li>
				<li>
					Moved the Branch component to its own module.
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
