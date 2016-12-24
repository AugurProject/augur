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
