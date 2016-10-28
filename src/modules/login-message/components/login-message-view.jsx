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
			<ul>
				<li>
					Oct 28, 2016 @ 12:14AM PST
				</li>
				<li>
					<ol>
						<li>
							Pointed <a href="https://augur-dev.firebaseapp.com">augur-dev</a> and <a href="http://local.augur.net">local.augur.net</a> at our private testing chain (geth JSON RPC endpoints: <a href="https://eth9000.augur.net">HTTPS</a>, <a href="wss://ws9000.augur.net">websockets</a>).  The public (Morden) testnet has been almost unusable for the past several weeks due to excessive network congestion.  Once things are moving on Morden again, our test instances will switch back.  (Note: <a href="https://app.augur.net">app.augur.net</a> remains pointed at the Morden testnet for now, although we may redirect that as well soon.)
						</li>
						<li>
							Percent fee now always displays as a positive number.
						</li>
						<li>
							Added a popup displaying the &quot;maximum number of shares&quot; you can buy at a particular limit price (only visible after you have entered a limit price).
						</li>
						<li>
							Increased the lifetime of chat messages (Whisper TTL) to 1 week; plan is to decrease this if/when the chatbox starts seeing more use.
						</li>
					</ol>
				</li>
				<li>
					Oct 27, 2016 @ 3:31AM PST
				</li>
				<li>
					<ol>
						<li>
							Added extra blocknumber check and catch-up for missed blocks due to dropped websocket connections.
						</li>
						<li>
							augur.js unit tests have been fixed/updated and are now working properly.
						</li>
					</ol>
				</li>
				<li>
					Oct 25, 2016 @ 11:33PM PST
				</li>
				<li>
					<ol>
						<li>
							If you create an account through our registration process, the block number in which you registered is saved (logged) to the blockchain.  The front-end now uses this registration blocknumber to intelligently set the lower bound (fromBlock) of <a href="https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getlogs">event log lookups</a>.  This should help speed up the lookup of your trading activity, which can be a data-heavy request.
						</li>
					</ol>
				</li>
				<li>
					Oct 25, 2016 @ 7:12PM PST
				</li>
				<li>
					<ol>
						<li>
							Fixed partial message chat input entry bug.
						</li>
						<li>
							Chat input text box now properly clears after sending.
						</li>
						<li>
							Added mutex locks to <a href="https://github.com/AugurProject/ethrpc">ethrpc&#39;s</a> transaction objects.  These are locked while the onNewBlock listener callback is executing.  This should prevent the &quot;callback-already-called&quot; exception that was sometimes thrown if 2+ blocks arrived in short succession (common right after private chain resets, when block times are abnormally fast).  I believe this fixes the persistent &quot;last trade price not updated&quot; error (although I am not positive -- please ping me if it is observed again).
						</li>
						<li>
							Chat input will no longer submit empty strings / strings containing only spaces.
						</li>
						<li>
							Users are no longer required to login to chat.
						</li>
						<li>
							Chatbox now auto-scrolls all the way to the bottom (if user was already at the bottom).
						</li>
						<li>
							Fixed duplicate list key warning in chatbox.
						</li>
						<li>
							Added address as popup text if user is chatting with their display name instead of address.
						</li>
						<li>
							Added Unicode support to chat.
						</li>
					</ol>
				</li>
				<li>
					Oct 25, 2016 @ 6:34AM PST
				</li>
				<li>
					<ol>
						<li>
							Sprinkle fixed the Firefox scrolling bug.
						</li>
						<li>
							Added chat box.  Right now there is just a single chat room for the entire site -- a &quot;trollbox&quot; ala Poloniex, Bittrex, et al.  The chat middleware is set up in a way that is trivially extensible, so if we decide we want separate chatboxes for each market, that is straightforward to add.  Note: the chat box uses <a href="https://github.com/ethereum/wiki/wiki/Whisper">Whisper</a>, a P2P messaging protocol that does not have any kind of persistence built-in.  Messages only last for a few minutes, and you have to be online to see new messages.
						</li>
						<li>
							Removed Doorbell.io (Feedback button) as people were not using it.
						</li>
						<li>
							Changed navbar/sidebar colors back to &quot;Augur purple&quot;, just to see how it looks.  (If users prefer the blue, can definitely change it back!)
						</li>
					</ol>
				</li>
				<li>
					Oct 23, 2016 @ 8:32PM PST
				</li>
				<li>
					<ol>
						<li>
							Buy/sell complete sets now have an implicit price assigned to them of 1/numOutcomes (that is, all outcomes are equally priced for the complete set).  The purpose behind this change is so that complete sets buy/sells can be included in per-outcome P/L calculations.  Note that, if this equal-price-per-outcome value differs from the market price at the time the complete set is bought or sold, the outcome realized P/L values may be somewhat different than if you executed an ordinary buy or sell trade!  However, the net realized P/L (for the entire market, across all outcomes) will be correct.
						</li>
					</ol>
				</li>
				<li>
					Oct 23, 2016 @ 2:38AM PST
				</li>
				<li>
					<ol>
						<li>
							Fixed P/L calculations for trades going from a net long to net short position, or vice-versa.
						</li>
						<li>
							&quot;Close Out Position&quot; has been re-labeled &quot;Redeem X Complete Sets&quot;.
						</li>
					</ol>
				</li>
				<li>
					Oct 22, 2016 @ 2:09AM PST
				</li>
				<li>
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
				</li>
			</ul>
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
