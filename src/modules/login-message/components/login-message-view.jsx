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
			<h3>November 13, 2016</h3>
			<ol>
				<li>
					Finished refactoring and thoroughly unit testing reporting timing methods (checkPeriod et al) in augur.js.
				</li>
				<li>
					Fixed/updated augur.js reporting-sequence integration tests to work properly with the refactored reporting tools.
				</li>
				<li>
					Fixed error on Reporting detail page.
				</li>
			</ol>
			<h3>November 12, 2016</h3>
			<ol>
				<li>
					Added rescaling logic for categorical and scalar reports to augur.js fixReport and (new) unfixReport methods, and updated event / report loaders in UI accordingly.
				</li>
				<li>
					Full reset of network 9000 (test chain) contracts.
				</li>
			</ol>
			<h3>November 11, 2016</h3>
			<ol>
				<li>
					Merged augur-core develop into master branch.
				</li>
				<li>
					Changed tick size to tenths on trade page.
				</li>
				<li>
					Added highlighting of the matching side of the order book when user clicks buy/sell.
				</li>
				<li>
					Fixed abnormally high CPU utilization on markets listing page.
				</li>
				<li>
					The trade page for scalar markets now properly displays the unit selection drop-down menu.  The share amounts on the page are updated automatically when a new unit is chosen.
				</li>
				<li>
					Fixed scalar market labels (no longer improperly labeled as categorical markets).
				</li>
			</ol>
			<h3>November 10, 2016</h3>
			<ol>
				<li>
					Added the first big batch of trading unit tests for the main augur repository.
				</li>
				<li>
					Your reported outcome is now displayed in bright red text when you have committed, but not yet revealed, your report.  It displays a tooltip telling you that you must remember to log back in to reveal your report.  (After the report is revealed, the reported outcome text reverts to a normal color.)
				</li>
				<li>
					Began refactoring the monolithic checkPeriod method in augur.js.  Set up mocks and stubs for unit testing.
				</li>
			</ol>
			<h3>November 9, 2016</h3>
			<ol>
				<li>
					Fixed the My Reports (Portfolio) display.
				</li>
				<li>
					Added reporting cycle information (cycle number and how many cycles ago) to the My Reports display.
				</li>
				<li>
					Added a red thumbs-down &quot;unethical&quot; icon to the My Reports display.  This appears by your reported outcome if you report a market unethical.
				</li>
				<li>
					Removed the fees collected column from My Reports, since this information is not yet accessible.
				</li>
				<li>
					Fixed the Ask / Ask Q. headers (switched positions).
				</li>
				<li>
					Improved load-events-with-submitted-report workflow: fixed penalize log-lookup, load event/report data from the reports state instead of the blockchain (where possible), and removed not-yet-implemented backend function calls.
				</li>
				<li>
					Added minValue, maxValue, and numOutcomes to the getMarketsInfo (compositeGetters contract) return array, and updated augur.js bindings.  augur.js now assigns a type field (scalar, binary, categorical) to each market object in getMarketsInfo.
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
