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
			<h3>November 28, 2016</h3>
			<ol>
				<li>
					The checkPeriod function now only looks up chain data on initial loading and when the reporting cycle phase changes.
				</li>
				<li>
					Removed code related to the market data refresh timer, which is no longer used.
				</li>
				<li>
					Added a generic hook for transaction callbacks to ethrpc.  The UI (or augur.js) can now register a transaction relay function that is automatically called any time any transaction is sent, succeeds, or fails.
				</li>
			</ol>
			<h3>November 27, 2016</h3>
			<ol>
				<li>
					Added answer-in-description reporting test markets for first 4 cycles on root branch.  (Example description: &quot;Binary Reporting Test Market (Cycle 1): correct answer is Yes&quot;)
				</li>
				<li>
					New testnet (Ropsten) genesis file is now bundled with augur.js.
				</li>
				<li>
					Fixed proportion-correct display on closed-market detail page and My Reports page.
				</li>
				<li>
					Fixed market result outcome name lookup for closed markets.
				</li>
				<li>
					The augur.js penaltyCatchUp sequence now calls closeMarket for all markets associated with the penalized event (instead of just extra markets beyond the first).  This may be a temporary fix, depending on how penalizeWrong on-contract method is changed.
				</li>
			</ol>
			<h3>November 26, 2016</h3>
			<ol>
				<li>
					Fixed new-branch first-reporting-cycle edge case on collectFees contract: collectFees method now always returns a value.
				</li>
				<li>
					Renewed augur.net wildcard SSL certificate (for eth2/3/9000 servers).
				</li>
				<li>
					Fixed trade page warning about minLimitPrice/maxLimitPrice types.
				</li>
				<li>
					Removed the block number restriction on best bid/ask order tracking on trades contract.  Best bid/ask now represent the best prices in any block, for a given market and outcome.  (The block number restriction is no longer necessary since the crossed-orders check simply returns an error for the later-arriving order, which is not placed on the book.)
				</li>
			</ol>
			<h3>November 25, 2016</h3>
			<ol>
				<li>
					Event IDs retrieved during composite lookups (getMarketInfo, batchGetMarketInfo, and/or getMarketsInfo) are now uniformly formatted.
				</li>
				<li>
					Added market/event ID parser method to the static API data of several augur.js wrappers.
				</li>
				<li>
					Combined first and second reporting test sequences into one method.
				</li>
				<li>
					Default HTTP and websocket hosted node URLs are now attached to the ethrpc (augur.rpc) object / editable by the consumer.
				</li>
			</ol>
			<h3>November 24, 2016</h3>
			<ol>
				<li>
					Restructured augur.js tests: moved unit tests and integration tests to separate folders.
				</li>
				<li>
					Updated UUID versions and package name in keythereum and augur.js.
				</li>
				<li>
					Updated middleware Travis CI builds to only run on updates to the master branch.
				</li>
				<li>
					Various fixes to augur UI unit tests.
				</li>
				<li>
					Merged Sprinkle&#39;s mega-PRs!  (These include fixes/improvements made over the past week.)
				</li>
			</ol>
			<h3>November 23, 2016</h3>
			<ol>
				<li>
					Added the ability to auto-populate a trade ticket by selecting any order present in either the outcomes list or order book.
				</li>
				<li>
					Expanded test coverage of the Augur API buy, sell, and shortAsk trade methods.
				</li>
			</ol>
			<h3>November 22, 2016</h3>
			<ol>
				<li>
					{`Visual indication of 'own' orders within a market outcome's order book.`}
				</li>
				<li>
					Improved min/max bound handling for both shares and limit price when creating a trade order.
				</li>
				<li>
					Auto highlight behavior change to order book on market view.
				</li>
				<li>
					Improvements to the scalar share denomination label handling.
				</li>
				<li>
					General improvements to Augur.js trade unit tests.
				</li>
				<li>
					{`Improved test coverage of Augur.js 'buy' method.`}
				</li>
				<li>
					{`Added test coverage for the Augur.js 'sendReputation' method.`}
				</li>
			</ol>
			<h3>November 21, 2016</h3>
			<ol>
				<li>
					Expanded and refined test coverage of the place trade action.
				</li>
				<li>
					Updated and added additional test coverage related to the market data and outcome trade components.
				</li>
				<li>
					Continued styling improvements to the market view.
				</li>
				<li>
					Bug fix related to the counts presented in both the header and footer navigational items.
				</li>
				<li>
					Improved state handling surrounding the outcome trade side selection.
				</li>
				<li>
					Safari and Mobile Safari specific UI fixes.
				</li>
				<li>
					Expanded and added additional selector shape coverage for market data and outcome trade selectors respectively.
				</li>
			</ol>
			<h3>November 18, 2016</h3>
			<ol>
				<li>
					General responsive improvments including:
					<ul>
						<li>
							Improvements to market view components to be fully responsive.
						</li>
						<li>
							{`Improvements to the markets view compoenents' existing responsiveness.`}
						</li>
						<li>
							Various miscellaneous UI responsiveness adjustments + improvements.
						</li>
					</ul>
				</li>
				<li>
					Improved UX of header and footer navigation.
				</li>
				<li>
					Inclusion of additonal swipe event to handle show/hide of side bar.
				</li>
			</ol>
			<h3>November 17, 2016</h3>
			<ol>
				<li>
					The trades contract now tracks the best bid and ask price within each block, and the buy/sell functions on the buy & sell shares contract verifies that incoming orders do not cross any previous orders in the same block.  (That is, it makes sure that bids do not exceed the best ask price and vice versa.)  If a make that would result in a crossed order is found, the later arriving order is not created, and an appropriate error message is relayed to the user.
				</li>
				<li>
					Better handling of mobile touch events, especially pertaining to nav reveal/hide swipe events.
				</li>
				<li>
					Additional responsive UI improvements.
				</li>
				<li>
					Expanded and refined testing coverage of the short sell trading functionality.
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
