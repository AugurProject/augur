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
			<h3>December 27, 2016</h3>
			<ol>
				<li>
					Fixed the ethicality displayed in converted transaction logs.
				</li>
				<li>
					Rounded off converted Reputation percents for display.
				</li>
				<li>
					Serialized log-to-transaction conversions.
				</li>
				<li>
					Refactored the winning positions lookup done in order to claim trading proceeds from closed markets.
				</li>
			</ol>
			<h3>December 26, 2016</h3>
			<ol>
				<li>
					Refactored the gigantic switch in the generic log-to-transactions converter into a collection of small, composable, testable subroutines.
				</li>
				<li>
					The status-and-message display data is now organized separate from the main Transaction component, in a new TransactionMessage component.
				</li>
			</ol>
			<h3>December 25, 2016</h3>
			<ol>
				<li>
					Removed the (unused) reporting period branch Reputation balance from the collectedFees log.
				</li>
				<li>
					Added a check of whether market has already been closed (winning outcomes already set) both before and after the closeMarket function is called from augur.js.
				</li>
				<li>
					Reporting cycle bar is now displayed at the top of the transactions page as well as the markets page.
				</li>
				<li>
					Removed unused reporting outcome display block.
				</li>
				<li>
					Load reporting history before branch sync (for logged in users).
				</li>
				<li>
					Added a special startup sequence to init-augur to allow semi-automated multi-user/single-machine reporting tests.
				</li>
				<li>
					Fixed payout lookup parameters in the account trade history log-loader.
				</li>
				<li>
					Used async.eachLimit instead of async.each in all log loaders to keep from overwhelming the receiving RPC server.
				</li>
				<li>
					Registration timestamps are now only recorded during the initial Airbitz account creation, not ordinary logins.
				</li>
				<li>
					Added an event-to-market lookup table to the front-end data store.
				</li>
				<li>
					Ad hoc balance and balance changes messaging in the transaction component have been replaced by a new balances array in the data field of any transaction that alters one or more balances.
				</li>
				<li>
					Each transaction conversion will now only retry once, if the required market data is not available.
				</li>
				<li>
					The fillOrder function now uses the correct side of order book.
				</li>
			</ol>
			<h3>December 24, 2016</h3>
			<ol>
				<li>
					Added minimumTradeSize parameter to buy, sell, and shortAsk on contract and in augur.js.
				</li>
				<li>
					Fixed event validity bond calculation on the createMarket contract.
				</li>
				<li>
					Added a client-side (augur.js) method to calculate the validity bond, so that this can be displayed to the market creator prior to creating the market.
				</li>
				<li>
					Added event validity bond calculation to step 5 of create market; added new arguments to step 5 of create market: period length, base reporters, number of events created in the past 24 hours, number of events in this reporting period.
				</li>
				<li>
					Removed unnecessary field renaming in filters API: sender/owner are no longer changed to maker/taker in log_fill_tx, log_add_tx, and log_cancel.
				</li>
				<li>
					Logs and filters now behave consistently and use the same field names everywhere.  (In augur.js, the augur.filters formatters are now used to parse logs in modules/logs.js.)
				</li>
				<li>
					Added getBaseReporters lookup to loadBranch (in augur.js), and added getPast24 and getNumberEvents lookups to syncBranch (in the UI).  These values are attached to the branch state in the UI.
				</li>
				<li>
					Log-lookup callback arguments are now consistent, and take an error as the first callback argument.
				</li>
				<li>
					Replaced most special-purpose log-lookup methods with calls to augur.getLogs.  A lot of semi-repeated code in modules/logs in augur.js has been removed as a result of this.
				</li>
				<li>
					Added registration log loader to the front-end.
				</li>
				<li>
					Removed deprecated code associated with market data updater timestamps.
				</li>
				<li>
					Price time series construction now uses logged timestamp instead of converting from block number.
				</li>
				<li>
					Removed onSuccess calculations from collectFees, since values are now pulled from the event log.
				</li>
				<li>
					Check if transaction already has status success before running onSuccess relay.
				</li>
				<li>
					The total amount of reputation reporting for the cycle is now displayed correctly in the collect fees transaction panel.
				</li>
				<li>
					The fillOrder action now updates market trades data and price history automatically.
				</li>
			</ol>
			<h3>December 23, 2016</h3>
			<ol>
				<li>
					Added single-order add/remove/fill actions and used for targeted, no-RPC order book updates from filters.
				</li>
				<li>
					Offloaded trades and bids/asks update logic in trade process methods onto filters.
				</li>
				<li>
					Adjustments to the NPM scripts to improve the messaging during command execution.
				</li>
				<li>
					The reporting form is now encompassed within a tab in the market view rather than being a discrete view.  This is so that users may continue to trade and so that reporters can reference relevant market data.
				</li>
				<li>
					The header in the markets view now updates to indicate when you are on the favorites or pending reports views.
				</li>
				<li>
					A slight adjustment to the Augur logo so that it remains centered in the header.  Previously the nav items would push the logo off center.
				</li>
			</ol>
			<h3>December 22, 2016</h3>
			<ol>
				<li>
					Converted maker trade transactions now have distinct messaging from normal (taker) trade transactions.
				</li>
				<li>
					Removed unnecessary registration filter.
				</li>
				<li>
					Refactored load-account-trades into composable loaders: deposit-withdraw, bids-asks, create-market, account-trades, and reporting.
				</li>
				<li>
					Placing a trade no longer automatically navigates you to the transactions view, but rather will leave you on the market view.
				</li>
				<li>
					Added final deleteTransaction call to trade process actions.
				</li>
				<li>
					Fees for maker trades no longer incorrectly display the taker fee.
				</li>
				<li>
					The trade inputs were incorrectly reporting invalid values via the hover title.  This is now fixed, along with a custom value incrementer implemented on the input.
				</li>
				<li>
					The app is now a full width app!  All components will scale out to whatever window width is available.
				</li>
				<li>
					Adjustments to the colors utilized due to a recent base color change.  Also included in this set of changes was a removal of some legacy colors no longer used.
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
