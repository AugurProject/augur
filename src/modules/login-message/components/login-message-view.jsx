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
			<h3>January 8, 2017</h3>
			<ol>
				<li>
					The cash contract now fires a sentCash event when the send or sendFrom functions complete successfully.  Supporting code has been added to the front-end listeners, the filters event formatter, and the transaction relay to listen for, parse, and automatically show on the transactions page.
				</li>
				<li>
					In-progress transaction messaging for closing out complete sets, &quot;send&quot; funds transactions (ether, real ether, and reputation), and initial order book generation is now handled entirely by the transaction relayer.  (Note: initial order book generation is currently not exposed in the UI.)
				</li>
				<li>
					Simplified the transactions module by removing two unnecessary methods (updateExistingTransaction and processTransactions).
				</li>
			</ol>
			<h3>January 7, 2017</h3>
			<ol>
				<li>
					Removed extraneous description fields from augur.js wrapper functions.  Descriptions are now handled by the relayer.
				</li>
				<li>
					Added isShortAsk parameter to on-contract sell function and its associated log_add_tx event.  The log_add_tx and log_short_fill_tx filters in augur.js autoconvert isShortAsk to a boolean value.
				</li>
				<li>
					Fixed final numMarketsToLoad value for descending loadMarkets.
				</li>
				<li>
					Added always-in-progress flag to relayed commitTrade transactions.
				</li>
				<li>
					Removed duplicate trading fees display in bid/ask/shortAsk transactions.
				</li>
				<li>
					Added isShortAsk field to relayed shortAsk transactions.
				</li>
				<li>
					Fixed short sell and short ask messaging.  Added log_short_fill_tx as a separate relayed transaction label.
				</li>
				<li>
					Simplified trade simulation setup by inlining the trade and short sell &quot;transaction&quot; objects.  Removed unused add-short-sell-transaction and add-trade-transaction files.
				</li>
			</ol>
			<h3>January 6, 2017</h3>
			<ol>
				<li>
					The Transaction component no longer has separate commit-to-buy/sell types.  These types now simply use the trade type the user is committing to.
				</li>
				<li>
					The transaction relayer now automatically fills in all fields for commit-trade, trade, and short-sell transactions by using the new, more detailed trade info fields attached to the tradeCommitment data store.
				</li>
				<li>
					Default &quot;scaffolding&quot; transaction updates have been removed from the relayer.
				</li>
				<li>
					Fixed in-progress vs completed messages for log_fill_tx.
				</li>
				<li>
					Assignment to the gasFees field now works correctly for relayed and logged trading transactions.
				</li>
				<li>
					Removed unnecessary dispatches from placeTrade and its subroutines.
				</li>
				<li>
					Added trade arguments and orders to the tradeCommitment datastore.
				</li>
				<li>
					The initial funding transaction log is now loaded alongside the registration timestamp transaction log.
				</li>
				<li>
					Replaced the ugly monster header with a &quot;regular&quot; header in the transactions view.
				</li>
			</ol>
			<h3>January 5, 2017</h3>
			<ol>
				<li>
					The messaging for trade, short_sell, and commitTrade transactions is now handled by the transaction relayer.  Deprecated manual transsaction messaging for these functions have been removed.
				</li>
				<li>
					Refactored place-trade: removed dispatcher from placeAsk, placeBid, placeShortAsk, and parametrizeOrder functions, and moved these functions to trade/actions/make-order.
				</li>
				<li>
					Simplified the selectScalarMinimum function and moved it to market/selectors/market.
				</li>
			</ol>
			<h3>January 4, 2017</h3>
			<ol>
				<li>
					Replaced manual transaction processors for trades (buy/sell); refactored and simplified placeTrade.
				</li>
				<li>
					Simplified default message generator in registerTransactionRelay.
				</li>
				<li>
					Removed unused disableAutoMessage transaction property.
				</li>
				<li>
					Fixed bond object in constructMarketCreatedTransaction; fixed constructMarketTransaction parameters; moved marketCreated label out of constructMarketTransaction group.
				</li>
				<li>
					Consolidated create market actions into submitNewMarket; removed manual create market transaction updates.
				</li>
				<li>
					Fixed adjusted-maker-fee calculation in constructLogAddTxTransaction.
				</li>
				<li>
					Added gasFees field to trading transactions in constructRelayTransaction.
				</li>
				<li>
					Added missing arguments to cancel in contructRelayTransaction.
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
