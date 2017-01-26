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
      <h3>January 25, 2017</h3>
      <ol>
        <li>Completed a simplification refactor to authentication views (Sign Up, Login, Import).  Styling is in-process.</li>
      </ol>
      <h3>January 24, 2017</h3>
      <ol>
        <li>
          Moved updateTradesInProgress trading actions post-processing to a new augur.js function, calculateTradeTotals.
        </li>
        <li>
          Moved placeTrade loop-thru-trading actions to new executeTradingActions function in augur.js.
        </li>
        <li>
          Added optional doNotMakeOrders parameter to executeTradingActions, placeTrade, placeBuy, placeSell, and placeShortSell functions.
        </li>
        <li>
          Fixed selectOrder references.
        </li>
        <li>
          Fixed isShortAsk parameter formatting in sell function.
        </li>
        <li>
          {"Fix to a 'double header' bug in OS X Safari when scrolling."}
        </li>
      </ol>
      <h3>January 23, 2017</h3>
      <ol>
        <li>
          Increased augur.js unit test coverage by about 10%.
        </li>
      </ol>
      <h3>January 21, 2017</h3>
      <ol>
        <li>
          augur.js minified build now works correctly.
        </li>
      </ol>
      <h3>January 19, 2017</h3>
      <ol>
        <li>
          Moved (almost) all trading logic from UI to augur.js.
        </li>
        <li>
          Added link to license (AAL) in footer.
        </li>
        <li>
          Added popover text for long outcome names in market preview panels.
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
