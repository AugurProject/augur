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
      <h3>January 31, 2017</h3>
      <ol>
        <li>
          Added fixReport and extra parameters to slashRep wrapper.
        </li>
        <li>
          Attach eventID field to marketInfo object for getMarketInfo.
        </li>
        <li>
          Removed newafterrep field from penalize filter.
        </li>
        <li>
          Always call callback after checking close extra markets, even if market(s) already closed.
        </li>
        <li>
          Only show rep penalization in penalize logs.
        </li>
        <li>
          Added slash rep info to report-form component.
        </li>
        <li>
          Attached onSubmitSlashRep to market selector.
        </li>
        <li>
          Added branch parameter to market view.
        </li>
        <li>
          Added slash-rep action to reports module.
        </li>
        <li>
          Fixed scalar report entry instructions.
        </li>
        <li>
          Added loadMarketsInfo to claimProceeds callback.
        </li>
        <li>
          Fixed order type references.
        </li>
        <li>
          Fixed portfolio.openOrders type (side) references.
        </li>
        <li>
          Added cancel-open-orders-in-closed-markets action to user-open-orders module.
        </li>
        <li>
          Added cancelOpenOrdersInClosedMarkets action to claimProceeds.
        </li>
        <li>
          Attached openOrders property to portfolio selector.
        </li>
        <li>
          Added open-orders selector to user-open-orders module.
        </li>
      </ol>
      <h3>January 29, 2017</h3>
      <ol>
        <li>
          Added useHostedNodeFallback prop, disable/enableHostedNodeFallback functions to ethrpc, and integrated these functions into the initial augur.js/ethereumjs-connect connection sequence.  Hosted node fallback can now be disabled simply by setting &quot;hostedNodeFallback&quot; to false in the front-end env.json configuration file.
        </li>
        <li>
          Trade simulations feePercent is now always positive.
        </li>
        <li>
          Fixed addOrder when orderbook is empty.
        </li>
        <li>
          Adds Dockerfile and instructions.
        </li>
        <li>
          Added within-order remaining-cash/-shares decrease in relayed transaction messages.
        </li>
      </ol>
      <h3>January 28, 2017</h3>
      <ol>
        <li>
          Added negative signs to bid/buy/shortSell simulated actions.
        </li>
        <li>
          Use static max value/amount for trade commit messaging.
        </li>
        <li>
          Fixed scalar price calculation in trade log transaction constructors.
        </li>
        <li>
          Fixed calculated trade amount for relayed buy trades in scalar markets.
        </li>
        <li>
          Reporting test setup time 900 for multi-user tests.
        </li>
        <li>
          Use send instead of sendFrom for cash (eth) transfers initiated by user.
        </li>
        <li>
          Fixed short-sell total cost calculated from logs.
        </li>
        <li>
          Return transaction array for short-sell relayed transactions.
        </li>
        <li>
          Separate trade (array) relay transaction handler from others.
        </li>
      </ol>
      <h3>January 27, 2017</h3>
      <ol>
        <li>
          Fixed simulated short sell cost calculation.
        </li>
        <li>
          Added isShortSell=true to tradeCommitmentCallback in executeTrade.
        </li>
        <li>
          Added getOrderBookChunked method to modules/compositeGetters.
        </li>
        <li>
          Put default orderbook chunk size (100) into constants.js.
        </li>
        <li>
          Fixed short-sell total cost calculated from logs.
        </li>
        <li>
          Return transaction array for short-sell relayed transactions.
        </li>
        <li>
          Separate trade (array) relay transaction handler from others.
        </li>
        <li>
          Trade commitment isShortSell field distinguishes between sell and short-sell for relayed commitTrade transactions.
        </li>
        <li>
          Order existence check in select-order-book (fixes no-order error for 3rd party logs).
        </li>
        <li>
          Moved chunked getOrderBook logic from load-bids-asks to augur.js.
        </li>
        <li>
          Fixed trade log reprocessing error.
        </li>
      </ol>
      <h3>January 26, 2017</h3>
      <ol>
        <li>
          Added chunking parameters to get_trade_ids; call increaseTagPopularity in modifyParticipantShares.
        </li>
        <li>
          Added tags contract to data_api with basic setters/getters for tag popularity.
        </li>
        <li>
          Fixed array concatenation in getTradingActions.
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
