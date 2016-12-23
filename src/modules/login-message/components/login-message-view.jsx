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
			<h3>December 20, 2016</h3>
			<ol>
				<li>
					An enhancement to the development workflow (HMR - Hot Module Reload) was not functioning properly and required some reconfiguration to properly handle live changes.  With the fixes in place, modules now update in real time, removing the requirement to either refresh the browser or restart the development server.
				</li>
				<li>
					Refined the UX surrounding the trade order creation process.  Previously the price would remain static if a value had been input, even when switching sides (Buy/Sell).  The price will now update automatically to the best avaialable price based on available orders whenever the trade side is changed.
				</li>
				<li>
					Placing a trade not longer automatically navigates you to the transactions view, but rather will leave you on the market view.
				</li>
			</ol>
			<h3>December 19, 2016</h3>
			<ol>
				<li>
					Heroku builds (app.augur.net) were failing due to changes encompassed within the migration to a unified code base with webpack as the primary bundler.  Resolved those issues and deployed an updated build.
				</li>
			</ol>
			<h3>December 16, 2016</h3>
			<ol>
				<li>
					The log_add_tx event API now includes a timestamp field.
				</li>
				<li>
					Trade log objects now include an augur.js-generated sequence number.
				</li>
				<li>
					Market links now work correctly in transactions generated from trade logs.
				</li>
				<li>
					The new build system now works correctly on Linux.
				</li>
				<li>
					Fixes/improvements to Windows builds.
				</li>
			</ol>
			<h3>December 15, 2016</h3>
			<ol>
				<li>
					Several fixes/improvements to the new build system.
				</li>
				<li>
					Fixed several visual and messaging bugs in transactions auto-generated from trade logs.
				</li>
				<li>
					Added Snapcraft file to augur repository.
				</li>
				<li>
					Removed deprecated files associated with the old market update timer (market-data-age and market-data-updater).
				</li>
				<li>
					Fixed missing property error thrown during market creation.
				</li>
				<li>
					Fixed hot-module-reload.
				</li>
				<li>
					Market descriptions now display properly in the transactions display.
				</li>
			</ol>
			<h3>December 14, 2016</h3>
			<ol>
				<li>
					Merged the augur-ui-react-components (AURC) repository into the augur (UI) repository.  AURC is now deprecated; all UI development will take place in the augur repository.
				</li>
				<li>
					Added support for yarn (in addition to npm); see updated README for details.
				</li>
				<li>
					Migrated build system from a collection of ad hoc scripts to webpack.
				</li>
				<li>
					Added hot-module-reload (HMR) support to the build system.  HMR propagates changes to the source code to the browser automatically, without requiring a page refresh.
				</li>
			</ol>
			<h3>December 13, 2016</h3>
			<ol>
				<li>
					Auto-update trades converted to transactions for trades with matching hashes.
				</li>
				<li>
					Event unit testing progress.
				</li>
				<li>
					Implemented hotjar tracking for augur-dev.firebaseapp.com and app.augur.net.
				</li>
			</ol>
			<h3>December 12, 2016</h3>
			<ol>
				<li>
					Fixed trade converted to transaction total cost and returns messages.
				</li>
				<li>
					Automatically convert incoming bids/asks and trade cancellation logs (from loadAccountTrades) to transactions formatted for display during the trade data update action.  Bids, asks, and cancel transactions are now loaded directly from the blockchain.
				</li>
				<li>
					Removed deprecated market-data-age and market-data-updater selectors.
				</li>
				<li>
					Added total return per share calculation to trade transaction conversion.
				</li>
				<li>
					Restructured bids/asks and cancels objects to match trade logs structure.
				</li>
			</ol>
			<h3>December 11, 2016</h3>
			<ol>
				<li>
					Added bids/asks and cancel log getters to modules/logs.
				</li>
				<li>
					Added account bids/asks and cancels data to loadAccountTrades.
				</li>
				<li>
					Automatically convert incoming trade logs (from loadAccountTrades) to transactions formatted for display during the trade data update action.  Trade transactions are now loaded directly from the blockchain (so your trade history is portable across browsers).
				</li>
			</ol>
			<h3>December 10, 2016</h3>
			<ol>
				<li>
					Added timestamp to log_add_tx and log_cancel.
				</li>
				<li>
					Added timestamp to complete sets logs.
				</li>
				<li>
					Added basic trade transaction reconstruction from logs to update-account-trades-data.
				</li>
				<li>
					Added takerFee, makerFee, transactionHash, and timestamp fields to account trade return value.
				</li>
				<li>
					Renamed tradeid -{'>'} trade_id in getMarketPriceHistory for consistency.
				</li>
				<li>
					Added trade ID to getMarketPriceHistory results.
				</li>
			</ol>
			<h3>December 9, 2016</h3>
			<ol>
				<li>
					Added isIndeterminate field to getReport default return.
				</li>
				<li>
					Removed redundant (and broken) getMarketTrades method from augur.js.  Please use getMarketPriceHistory instead, a function that is not broken and retrieves the same information.
				</li>
				<li>
					All fixed-point fields in the log_fill_tx event logs are now auto-converted to regular (stringified) numbers.  Note that log_fill_tx and log_add_tx are the only two filters where fixed-point conversions is automatically performed.
				</li>
				<li>
					Updated load-report and load-reports tests.
				</li>
			</ol>
			<h3>December 8, 2016</h3>
			<ol>
				<li>
					Indeterminate reports now load and reveal correctly for all three market types.
				</li>
				<li>
					Fixed outcome name displays in reveal report transactions.
				</li>
				<li>
					The no-report callback argument for getReport wrapper now uses the same object structure as the unfixReport function.
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
