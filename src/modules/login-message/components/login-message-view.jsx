import React, { PropTypes } from 'react';
import Link from 'modules/link/components/link';

const LoginMessagePage = p => (
	<section id="login_message_view" >
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
					{`A note on price/time priority on the blockchain.  The site is only as fast as Ethereum blocks are mined.  Augur's matching engine sorts order books by price, then by block number, then by transaction index. Within a single block, transactions are ordered by the miner who mines the block.  When constructing a block, miners typically order transactions first by gasprice (highest to lowest), and then by the order received (oldest to newest).  So, Augur's "price/blocknumber/transaction index priority" ordering is generally equivalent to price/time priority, if there are differing gasprices within the block, the transaction index is not guaranteed to be time-ordered.  (Presently, Augur does not attempt to adjust gasprices in response to other pending transactions, although, if desired, gasprice can be adjusted manually using the API, by changing the "gasPrice" field attached to every sendTransaction payload.)`}
				</li>
			</ol>
			<h2>Technical updates:</h2>
			<h3>November 8, 2016</h3>
			<ol>
				<li>
					Fixed report panel component and links.  Reporting should now work with the re-skinned market detail page!
				</li>
				<li>
					The Feedback tab now sends user feedback to UserVoice, instead of Doorbell.io.
				</li>
				<li>
					Added penalizationCatchup to checkPeriod callback sequence for users who are multiple reporting cycles behind.
				</li>
				<li>
					Added a constant (all-ones) initialization vector to the encryptReport and decryptReport middleware functions if a salt argument is not supplied.  Although the report needs to be encrypted with its salt, the (separately) encrypted salt does not need its own random salt.
				</li>
				<li>
					Removed refund macro from collectFees contract, since the transaction value must be accessed (and is expected to be non-zero) in the body of the method.
				</li>
				<li>
					Fixed sufficient value check in collectFees contract.
				</li>
				<li>
					Automatically add (500K wei)*gasPrice of value to the collectFees transaction payload in augur.js.
				</li>
				<li>
					Fixed final report market page link in next-report-page.
				</li>
				<li>
					Fixed REP balance comparison at the beginning of check-period.
				</li>
			</ol>
			<h3>November 7, 2016</h3>
			<ol>
				<li>
					Reskinned the trade (market detail) page.  There are a few minor bugs remaining but the trade page is fully functional and has an immensely improved look-and-feel!
				</li>
				<li>
					Fixed event description display for reveal-reports transactions.
				</li>
				<li>
					Fixed the claim-proceeds action, which is the final bet-payout mechanism once markets are successfully reported on and closed.  This action was incorrectly firing claimMarketProceeds calls for some markets that were not yet closed.
				</li>
				<li>
					Added updateAssets and refreshMarkets calls after claim-proceeds completes successfully.
				</li>
				<li>
					Reordered checkPeriod callback sequences to allow for full reporter catch-up even if their REP redistribution is behind by multiple periods.  Also added an extra check for REP redistribution to the submitReportHash onSuccess callback, which should short-circuit failing submitReportHash loops, if they are caused by not being caught up on penalizations/redistributions.
				</li>
				<li>
					Fixed chat messages display sent by users who do not have a name set (address-only).
				</li>
			</ol>
			<h3>November 6, 2016</h3>
			<ol>
				<li>
					Reports from previous periods are now properly cleared from your pending reports.
				</li>
				<li>
					Refactored commit-report and its associated methods, and rewrote / greatly expanded the commit-report test suite.
				</li>
				<li>
					Added a message to markets that have been reported on and closed out: &quot;This market is closed. Reported outcome: X&quot;
				</li>
				<li>
					Made a modified reporting test sequence script that goes through a second full reporting cycle on the same branch ID that has already successfully completed its initial reporting cycle.  Completed full test runs of both the initial reporting cycle sequence as well as multiple follow-up sequences.  These automated use-tests only use a single reporter, but the results are as expected for this reporter.  Next-up: automated reporting sequences using multiple accounts!
				</li>
				<li>
					Decoupled the UI reportingTestSetup method from its spawn-new-branch subroutine.
				</li>
				<li>
					Refactored load-reports and associated methods.  load-reports is a group of functions that build the reports data structure (as well as update other related data) in the front-end.  They lookup what events you are required to report on, which of these you have already reported on, pull your encrypted report and salt from the chain (and decrypt them), lookup if you have submitted a report hash or plaintext report, collates this info and stows it in Redux (the front-end data store).  These methods did not have good unit test coverage (my fault -- they became more complicated over time and the tests did not keep up).  Since I have found multiple edge-case bugs over the past few days as I am user-testing reporting, I decided to take the time to pull these methods apart and added more thorough unit tests for them.  Coverage is now significantly improved for these methods.  (Note: to simplify mock creation for the unit tests, I split load-reports into several separate files/methods: load-reports, load-report, load-report-descriptors, and decrypt-reports.)
				</li>
			</ol>
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
	</section>
);

LoginMessagePage.propTypes = {
	marketsLink: PropTypes.object // TODO
};

export default LoginMessagePage;
