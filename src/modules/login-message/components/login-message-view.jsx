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
			<h3>January 3, 2017</h3>
			<ol>
				<li>
					The front-end orderbook data store is now properly updated by the trade (log_fill_tx) and bid/ask (log_add_tx) filters.
				</li>
				<li>
					Only show balances in payout transaction display once the transaction has completed.
				</li>
				<li>
					Fixed winning outcome shares selection for categorical markets.
				</li>
			</ol>
			<h3>January 2, 2017</h3>
			<ol>
				<li>
					Streamlined the conditional fund-new-account and registration timestamp actions during login and registration.
				</li>
				<li>
					Moved the in-progress display logic for new account funding and timestamping to the transaction relayer.
				</li>
				<li>
					Verify that user has a winning position with greater than zero shares before calling the trading payout functions in augur.js.
				</li>
				<li>
					Moved the branch synchronization sequence specific to reporters to a separate action, and added a check for non-zero REP balance prior to dispatching this action.
				</li>
				<li>
					Logging in to an existing account now triggers free account funding if any balances are zero, instead of only checking if the account&#39;s &quot;ether&quot; balance is zero.
				</li>
				<li>
					Importing an account from file now (conditionally) triggers funding and registration timestmap actions.
				</li>
				<li>
					Reordered loadLoginAccountDependents actions: registration timestamp lookup now happens before updateAssets.
				</li>
				<li>
					Added allAssetsLoaded method to the balances selector.
				</li>
				<li>
					Added fundNewAccount the transaction relayer.
				</li>
				<li>
					The default transaction constructor now allows custom message and description fields.
				</li>
				<li>
					The updateAssets callback now only fires once, after all assets are loaded.
				</li>
				<li>
					The FUND_ACCOUNT header text in the transactions display is now &quot;Fund Account&quot;.
				</li>
			</ol>
			<h3>January 1, 2017</h3>
			<ol>
				<li>
					Moved the in-progress display logic for market creation, trading payouts (claim-proceeds), registration, and REP transfers and approvals to the transaction relayer.
				</li>
				<li>
					All messaging callbacks have been removed from claimMarketsProceeds in augur.js.
				</li>
				<li>
					Trading payout receipts in augur.js are now parsed using the filters event message parser.
				</li>
				<li>
					Updates to the <a className="link" href="http://blog.augur.net/faq/how-do-i-savebackup-my-wallet/" target="_blank" rel="noopener noreferrer">augur-abi</a> middleware module: added negative number support to the format_int256 method, and added an unfix_signed method to unfix and wrap to negative if needed.
				</li>
				<li>
					Added status parameter to constructRelayTransaction; assign in-progress/success status depending on if blockHash is set.
				</li>
				<li>
					Gas fees and timestamps now display properly for all relayed transaction types.
				</li>
				<li>
					Fixed gasFees formatting for transactions that are manually updated by the front-end.
				</li>
				<li>
					Removed deprecated messaging callbacks from checkPeriod.
				</li>
				<li>
					Added a &quot;closedMarket&quot; log to the CloseMarket contract that includes the market ID, branch ID, and sender account address for the market being closed.  The old closeMarket_logReturn filter in the front-end has been replaced with the new closedMarket filter.
				</li>
				<li>
					Changed the initial report value for scalar events to an empty string to fix an uncontrolled-to-controlled input warning generated by React.
				</li>
				<li>
					Removed register from no-relay list.
				</li>
				<li>
					Removed manual Reveal Report transaction messaging code.
				</li>
				<li>
					Replaced &quot;in progress&quot; transaction status text with &quot;submitted&quot;.
				</li>
				<li>
					Your account positions are now reloaded after claiming trading payouts.
				</li>
			</ol>
			<h3>December 31, 2016</h3>
			<ol>
				<li>
					Fixed the &quot;isUnethical&quot; calculation in constructSubmittedReportTransaction and constructSubmittedReportHashTransaction.
				</li>
				<li>
					Added missing dispatch arguments to constructReportingTransaction cases.
				</li>
				<li>
					Added report styling and unethical report &quot;thumbs-down&quot; icon to the Transaction component.
				</li>
				<li>
					The buildDescription function inside the Transaction component has been replaced with a new TransactionDescription component.
				</li>
				<li>
					Moved report ethicality display into separate ReportEthics component, and replaced ethics displays in My Report and Transaction with ReportEthics component.  Removed report ethicality display logic from formatReportedOutcome.
				</li>
				<li>
					Attached id (market ID), minValue, amd maxValue properties to the market info objects fetched by getMarketInfo, getMarketsInfo, and batchGetMarketInfo in augur.js.
				</li>
				<li>
					Fixed two React warnings: 1) Added a new hidePrefix property to the ValueDenomination component and used it instead of conditionally displaying the freeze prefix value. 2) Changed the default null state values in the ReportForm component to undefined.
				</li>
				<li>
					In the branch synchronization sequence, getPenalizedUpTo and getCollectedFees are now only called if the user is logged in.
				</li>
				<li>
					Added a long dash (&mdash;) display in the &quot;end date&quot; column of My Reports if the end date is not available.
				</li>
				<li>
					Outcomes reported as both Indeterminate and Unethical are now displayed correctly in relayed Commit Report transactions.
				</li>
				<li>
					All manual commitReport transaction create/update/delete actions have been replaced by the transaction relay.
				</li>
				<li>
					Added a report encryption wrapper to the front-end.
				</li>
				<li>
					Indeterminate reports are now correctly converted to hexadecimal strings in augur.js fixReport method.
				</li>
				<li>
					Converted main trade logged-transaction loop to async.forEachOfSeries for proper getMarketInfo callback closure.
				</li>
				<li>
					Added initial check if &quot;from&quot; field matches login account address before processing relayed transactions.
				</li>
				<li>
					Fixed a reassignment error in place-trade.
				</li>
				<li>
					Filled in collectFees front-end transaction relayer.
				</li>
				<li>
					Added a check for the second half of the reporting period to the collectFees block of the composite reporting synchronization / updating methods in augur.js.
				</li>
				<li>
					The relayed transaction gasFees field now is included in filtered/converted transactions, if it is available (in-memory).
				</li>
			</ol>
			<h3>December 30, 2016</h3>
			<ol>
				<li>
					Moved collectFees logic to augur.js: fee collection now handled automatically by augur.checkPeriod.
				</li>
				<li>
					The UI sync-branch-with-blockchain logic now looks up the last report cycle penalized and and the fee collection status of the cycle being checked for penalties.  Both of these fields are now attached to the branch data store and available in the front-end.
				</li>
				<li>
					Filled in switch cases for submitReport, submitReportHash, penalizeWrong, and penalizationCatchup in the front-end part of the transaction relayer.
				</li>
			</ol>
			<h3>December 29, 2016</h3>
			<ol>
				<li>
					Fixed/updated all downstream actions from or calling to bid, ask, and short ask.
				</li>
			</ol>
			<h3>December 28, 2016</h3>
			<ol>
				<li>
					Replaced deprecated bid, ask, and short ask transaction-related code with simple calls to augur.js.  All transaction display updating and messaging is now handled automatically by the transation relay and filters.
				</li>
				<li>
					Added possible events that can be logged by a method call to API maker script.
				</li>
				<li>
					Added error / null return checks to load-then-retry-conversion callbacks.
				</li>
				<li>
					Refactored trading log-to-transaction conversions.
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
