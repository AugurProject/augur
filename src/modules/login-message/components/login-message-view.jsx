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
      <h3>February 7, 2017</h3>
      <ol>
        <li>
          Renamed data_api/tags.se contract to data_api/topics.se and updated function names for &quot;primary tag&quot; to &quot;topic&quot;.
        </li>
        <li>
          The getTopicsInfo(Chunked) wrapper functions in augur.js now return objects (where the keys are topic names and values are popularities) instead of arrays.  The topics selector in the front-end converts the stored topics object to a sorted array.
        </li>
      </ol>
      <h3>February 5, 2017</h3>
      <ol>
        <li>
          The transaction relay in ethrpc now automatically adds the transaction hash the onFailed callback argument when it is available (usually only for transactions with mutable returns).
        </li>
        <li>
          Default hosted nodes in ethrpc are now (temporarily) using network 9000, due to severe congestion on Ropsten.
        </li>
        <li>
          Added placeAskAndShortAsk to placeSell sequence, to makeOrder, and to placeTrade sequence and tests.
        </li>
        <li>
          Trade and short-sell receipt parsing are now handled by dedicated methods in augur.js.
        </li>
        <li>
          The final trading callback for multi-action sequences now always fires at the correct time.
        </li>
        <li>
          Added logic to delete trade/short_sell transaction on empty trade to constructRelayTransaction.  This fixes an error where sometimes simultaneous trades would both appear as &quot;successful&quot;, but only one trader would actually get the shares from the trade.
        </li>
        <li>
          Sell complete sets has been disabled in the front-end, since this will be handled automatically by the contracts in the (upcoming) updated contract version.
        </li>
      </ol>
      <h3>February 4, 2017</h3>
      <ol>
        <li>
          Replaced orderBooks object with getOrderBooks function in placeTrade and subroutines.
        </li>
        <li>
          Added new modifyOrderBook module: makes local changes to order book.
        </li>
        <li>
          Fixed fullPrecisionPrice/price order in adjustScalarOrder.
        </li>
        <li>
          For orders filled by the user, call fillOrder in constructRelayTransaction instead of log_fill_tx callback.
        </li>
        <li>
          Refactored market order book updating functions: these functions now call to modifyOrderBook functions in augur.js, and replace the existing order book, instead of updating it.
        </li>
      </ol>
      <h3>February 3, 2017</h3>
      <ol>
        <li>
          Report and Snitch tabs on market detail page now use isReportTabVisible market selector property to determine visibility.
        </li>
        <li>
          Reporting markets listing filter now works correctly.
        </li>
        <li>
          Scalar market outcome input box now displays correctly in the Snitch tab.
        </li>
        <li>
          The first tag defined during market creation is now the &quot;primary tag&quot; or &quot;topic&quot; for the market.  A new contract, data_api/tags.se, now tracks the &quot;popularity&quot; of each tag, defined (for simplicity) as the sum of the volume of all markets that share a particular primary tag.  (This crude metric will be fine-tuned through user testing.)  The initial landing page will be a display of the most popular tags, rather than a list of all markets. <a
              className="link"
              href="http://augur.link/topics-page-sketch.jpg"
              target="_blank"
              rel="noopener noreferrer"
            >Here is a sketch of what this will look like.</a>  There are a few advantages of this approach:
          <ol>
            <li>
              The initial page load will be faster, since all markets will not be downloaded immediately.
            </li>
            <li>
              Tags are stored as &quot;short strings&quot; (i.e., normal 256-bit integers) on contract, so it is possible to search for them on-chain; that is, without first downloading all the tags either to the browser or to a persistent datastore.  (Market/event descriptions, by contrast, are bytearrays that are not limited to 256 bits, so on-chain search is too slow to be practical.)
            </li>
            <li>
              In my opinion, it is more intuitive than the landing page we have now.  Users may not have a particular market they want to trade in when they come to Augur, but I think the vast majority will have a topic in mind: users that are interested trading politics are probably different overall than users that want to trade financials, or sports, etc.  I further think that average volumes will probably be quite different between topics (e.g., financials might be an order of magnitude more popular than politics), and I think that a user interested in political markets might be turned off if the initial display was composed entirely of financial markets.  &quot;Oh, looks like just stocks and stuff,&quot; they would think, and then leave.  Similarly if the most popular markets happen to all be horse races, or sports, or celebrity gossip, etc.  In short, I think a landing page structured around topics instead will be an overall improved UX for users that want to browse, or are not exactly sure of the market they want to use.  (For reference, although the focus is of course somewhat different, bet365 is a good example of a site that first displays &quot;topics&quot; to users.)
            </li>
          </ol>
        </li>
      </ol>
      <h3>February 2, 2017</h3>
      <ol>
        <li>
          Re-uploaded all Augur contracts to the Ropsten testnet (network 3) and our private test chain (network 9000).
        </li>
      </ol>
      <h3>February 1, 2017</h3>
      <ol>
        <li>
          {`Added the ability to 'close' an existing market position.
            This action will determine if a position can be either fully or partially closed based on the current order book state and will attempt to do so at the best available price.`}
        </li>
        <li>
          Snitch (slashRep) messaging now displays correctly.
        </li>
        <li>
          Fixed reporterIndex reference in slashRep function.
        </li>
        <li>
          Fixed eventID reference in slashedRep log and added a timestamp.
        </li>
        <li>
          Added missing doNotMakeOrders and tradeCommitLockCallback arguments to placeShortSell from placeSell.
        </li>
        <li>
          Added arguments lengthcheck to the first if statement in augur.js bindContractMethod.
        </li>
        <li>
          Updated/removed expired events from &quot;canned markets&quot; list.
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
